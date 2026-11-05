"""Generate the bundled English male prologue with the CC0 Piper Joe voice.
Install piper-tts first. Model downloads stay in ignored voice-cache.
"""
from pathlib import Path
import io,json,urllib.request,wave
from piper import PiperVoice,SynthesisConfig
ROOT=Path(__file__).resolve().parents[2]
cache=ROOT/'mobile/tools/voice-cache';cache.mkdir(exist_ok=True)
url='https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/joe/medium/'
for suffix in ['', '.json']:
 target=cache/('joe.onnx'+suffix)
 if not target.exists(): urllib.request.urlretrieve(url+'en_US-joe-medium.onnx'+suffix,target)
p=ROOT/'games/openworld/public/cinematic'
voice=PiperVoice.load(str(cache/'joe.onnx'))
lines=['Once, the crown held the dawn.','Then its light was shattered.','In Solmere, every lantern guards a memory.','Beyond the last warm hearth, forgotten roads awaken.','Carry the light. Find what was lost.','And let the world remember.','Sunshard. The Sundered Crown.']
data=[];timings=[];total=0
for text in lines:
 b=io.BytesIO()
 with wave.open(b,'wb') as w:voice.synthesize_wav(text,w,syn_config=SynthesisConfig(length_scale=1.35))
 b.seek(0)
 with wave.open(b,'rb') as w:rate=w.getframerate();samples=w.readframes(w.getnframes())
 timings.append([round(total/rate/2,3),text]);samples+=b'\0'*int(rate*2*0.8);data.append(samples);total+=len(samples)
with wave.open(str(p/'prologue.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(data))
(p/'subtitles.json').write_text(json.dumps(timings))
s=ROOT/'games/openworld/client/src/cinematic.ts';src=s.read_text();start=src.index('const lines:');end=src.index('let playing = false');s.write_text(src[:start]+'const lines: [number, string][] = '+json.dumps(timings)+'\n'+src[end:])
(p/'VOICE-LICENSE.txt').write_text(urllib.request.urlopen(url+'MODEL_CARD').read().decode()+'\nBundled narration: Piper Joe, English male; source dataset CC0.\nGenerated locally with piper-tts. No voice cloning.\n')
print('Joe male narration generated:',round(total/rate/2,2),'seconds')
