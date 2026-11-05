package com.sunshard.rpg;

import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.*;
import com.google.android.gms.ads.interstitial.*;
import com.google.android.gms.ads.rewarded.*;
import com.google.android.ump.*;
import com.android.billingclient.api.*;
import java.util.*;

/** Native ads and Play-owned non-consumable. Debug builds use Google's demo placements. */
@CapacitorPlugin(name = "Monetization")
public class MonetizationPlugin extends Plugin {
    private AdView banner;
    private InterstitialAd interstitial;
    private RewardedAd rewarded;
    private BillingClient billing;
    private ProductDetails product;
    private boolean owned, initialized, bannerWanted;
    private long lastInterstitial = android.os.SystemClock.elapsedRealtime();
    private final String productId = "remove_ads";
    private final String testPrefix = "ca-app-pub-3940256099942544/";
    private boolean testing() { return (getContext().getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0; }
    private String unit(String key, String test) {
        if (testing()) return testPrefix + test;
        int id = getContext().getResources().getIdentifier(key, "string", getContext().getPackageName());
        return id == 0 ? "" : getContext().getString(id);
    }
    @Override public void load() {
        owned = getContext().getSharedPreferences("store", 0).getBoolean("remove_ads", false);
        billing = BillingClient.newBuilder(getContext()).setListener((result, purchases) -> {
            if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) process(purchases);
            notifyListeners("storeChanged", new JSObject().put("message", result.getDebugMessage()).put("owned", owned));
        }).enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()).build();
        connect();
    }
    private void connect() {
        if (billing.isReady()) { refresh(); return; }
        billing.startConnection(new BillingClientStateListener() {
            public void onBillingSetupFinished(BillingResult r) { if (r.getResponseCode() == 0) refresh(); }
            public void onBillingServiceDisconnected() { product = null; }
        });
    }
    private void refresh() {
        billing.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(), (r, list) -> {
            if (r.getResponseCode() == 0) { setOwned(list.stream().anyMatch(p -> p.getProducts().contains(productId) && p.getPurchaseState() == Purchase.PurchaseState.PURCHASED)); process(list); }
        });
        billing.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(QueryProductDetailsParams.Product.newBuilder().setProductId(productId).setProductType(BillingClient.ProductType.INAPP).build())).build(), (r, details) -> {
            if (r.getResponseCode() == 0 && !details.getProductDetailsList().isEmpty()) product = details.getProductDetailsList().get(0);
        });
    }
    private void process(List<Purchase> purchases) {
        for (Purchase p : purchases) if (p.getProducts().contains(productId) && p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            setOwned(true);
            if (!p.isAcknowledged()) billing.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), r -> {});
        }
    }
    private void setOwned(boolean value) {
        owned = value;
        getContext().getSharedPreferences("store", 0).edit().putBoolean("remove_ads", value).apply();
        getActivity().runOnUiThread(() -> { updateBanner(); notifyListeners("storeChanged", new JSObject().put("owned", owned)); });
    }
    @PluginMethod public void status(PluginCall call) {
        JSObject result = new JSObject().put("owned", owned).put("available", product != null);
        if (product != null && product.getOneTimePurchaseOfferDetails() != null) result.put("price", product.getOneTimePurchaseOfferDetails().getFormattedPrice());
        call.resolve(result);
    }
    @PluginMethod public void restore(PluginCall call) { connect(); call.resolve(); }
    @PluginMethod public void purchase(PluginCall call) {
        if (!billing.isReady() || product == null) { connect(); call.reject("Install through Google Play testing to purchase. Product remove_ads must be configured at US$4.99."); return; }
        getActivity().runOnUiThread(() -> {
            BillingResult r = billing.launchBillingFlow(getActivity(), BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(product).build())).build());
            if (r.getResponseCode() == 0) call.resolve(); else call.reject(r.getDebugMessage());
        });
    }
    @PluginMethod public void initialize(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (testing()) { initAds(); call.resolve(); return; }
            ConsentInformation info = UserMessagingPlatform.getConsentInformation(getContext());
            info.requestConsentInfoUpdate(getActivity(), new ConsentRequestParameters.Builder().build(), () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(getActivity(), error -> { if (info.canRequestAds()) initAds(); call.resolve(); }), error -> { if (info.canRequestAds()) initAds(); call.resolve(); });
        });
    }
    private void initAds() { if (initialized) return; initialized = true; MobileAds.initialize(getContext(), status -> getActivity().runOnUiThread(() -> { preload(); updateBanner(); })); }
    @PluginMethod public void privacy(PluginCall call) { getActivity().runOnUiThread(() -> UserMessagingPlatform.showPrivacyOptionsForm(getActivity(), error -> { if (error != null) call.reject(error.getMessage()); else call.resolve(); })); }
    @PluginMethod public void banner(PluginCall call) { bannerWanted = Boolean.TRUE.equals(call.getBoolean("visible", false)); getActivity().runOnUiThread(() -> { updateBanner(); call.resolve(); }); }
    private void updateBanner() {
        boolean show = bannerWanted && !owned && initialized;
        String id = unit("admob_banner", "6300978111");
        if (id.isEmpty()) show = false;
        if (show && banner == null) {
            banner = new AdView(getContext()); banner.setAdUnitId(id); banner.setAdSize(AdSize.BANNER);
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
            ((ViewGroup)getBridge().getWebView().getParent()).addView(banner, params);
            banner.loadAd(new AdRequest.Builder().build());
        }
        if (banner != null) banner.setVisibility(show ? View.VISIBLE : View.GONE);
        // Reserve layout space in native pixels: never cover game controls or the system navigation bar.
        View web = getBridge().getWebView(); ViewGroup.MarginLayoutParams lp = (ViewGroup.MarginLayoutParams)web.getLayoutParams();
        lp.bottomMargin = show ? AdSize.BANNER.getHeightInPixels(getContext()) : 0; web.setLayoutParams(lp);
    }
    private void preload() {
        String i = unit("admob_interstitial", "1033173712"), r = unit("admob_rewarded", "5224354917");
        if (!owned && !i.isEmpty()) InterstitialAd.load(getContext(), i, new AdRequest.Builder().build(), new InterstitialAdLoadCallback() { public void onAdLoaded(@NonNull InterstitialAd ad) { interstitial = ad; } });
        if (!r.isEmpty()) RewardedAd.load(getContext(), r, new AdRequest.Builder().build(), new RewardedAdLoadCallback() { public void onAdLoaded(@NonNull RewardedAd ad) { rewarded = ad; } });
    }
    @PluginMethod public void interstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (owned || interstitial == null || android.os.SystemClock.elapsedRealtime() - lastInterstitial < 180000) { call.resolve(); return; }
            InterstitialAd ad = interstitial; interstitial = null; lastInterstitial = android.os.SystemClock.elapsedRealtime();
            ad.setFullScreenContentCallback(new FullScreenContentCallback() { public void onAdDismissedFullScreenContent() { preload(); call.resolve(); } public void onAdFailedToShowFullScreenContent(AdError error) { preload(); call.resolve(); } }); ad.show(getActivity());
        });
    }
    @PluginMethod public void reward(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (rewarded == null) { if (initialized) preload(); call.reject("No video available. Please try again later."); return; }
            RewardedAd ad = rewarded; rewarded = null; final boolean[] earned = {false};
            ad.setFullScreenContentCallback(new FullScreenContentCallback() { public void onAdDismissedFullScreenContent() { preload(); call.resolve(new JSObject().put("earned", earned[0])); } public void onAdFailedToShowFullScreenContent(AdError e) { preload(); call.reject(e.getMessage()); } });
            ad.show(getActivity(), reward -> earned[0] = true);
        });
    }
    @Override protected void handleOnResume() { if (billing != null) connect(); if (banner != null) banner.resume(); }
    @Override protected void handleOnPause() { if (banner != null) banner.pause(); }
    @Override protected void handleOnDestroy() { if (banner != null) banner.destroy(); if (billing != null) billing.endConnection(); }
}
