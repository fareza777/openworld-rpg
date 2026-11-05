"""The fork's names (docs/sunshard/LEXICON.md) in the later chapters' player-visible text.

Only the text inside string literals is changed (and only English phrases: Chinese text is left as it is); comments and
identifiers are not touched, so ids, saves and kept-ids keep. Run from the repo root:
    python games/openworld/tools/lexicon-rename.py <files...>
"""
import re
import sys

# longest first, so "the Second Seal-bearer" is not read as "the Second Seal" + "-bearer"
PHRASES = [
    ("the Second Seal-bearer", "the Second Warden"), ("the Third Seal-bearer", "the Third Warden"),
    ("the Fourth Seal-bearer", "the Fourth Warden"), ("the Fifth Seal-bearer", "the Fifth Warden"),
    ("Seal-bearers", "Wardens"), ("Seal-bearer", "Warden"),
    ("The Second Seal", "The Ember Chain"), ("the Second Seal", "the Ember Chain"),
    ("The Third Seal", "The Golden Scales"), ("the Third Seal", "the Golden Scales"),
    ("The Fourth Seal", "The Starfall Wood"), ("the Fourth Seal", "the Starfall Wood"),
    ("The Drowned Lantern", "The Starfall Wood"), ("the Drowned Lantern", "the Starfall Wood"),
    ("The Fifth Seal", "The Vigil Lance"), ("the Fifth Seal", "the Vigil Lance"),
    ("Chain of the Scourging Post", "Ember Chain"),
    ("Crown of Thorns", "Briar Diadem"),
    ("Holy Lance", "Vigil Lance"),
    ("The Holy City", "Solmere"), ("the Holy City", "Solmere"), ("Holy City", "Solmere"),
    ("Emberfall", "Cinderholt"), ("Firstlight", "Emberwick"),
    ("Matthias the War-Giver", "Matthias the Ember-Sworn"), ("War-Giver", "Ember-Sworn"),
    ("the Priest of the Black Scales", "Warden of the Golden Scales"), ("Priest of the Black Scales", "Warden of the Golden Scales"),
    ("The Scale of Hunger", "The Golden Scales"), ("the Scale of Hunger", "the Golden Scales"), ("Scale of Hunger", "Golden Scales"),
    ("Lumi", "Kiri"), ("Severin", "Corvin"), ("Alberic", "Gavrel"), ("Ilse", "Maren"),
    ("The Church's", "The Order's"), ("the Church's", "the Order's"), ("Church's", "Order's"),
    ("The Church", "The Order"), ("the Church", "the Order"),
    ("the Primate", "the High Luminant"), ("The Primate", "The High Luminant"), ("Primate", "High Luminant"),
    ("the pilgrim's", "the Crownseeker's"), ("The pilgrim's", "The Crownseeker's"),
    ("the pilgrim", "the Crownseeker"), ("The pilgrim", "The Crownseeker"),
    (", pilgrim", ", Crownseeker"), ("Pilgrim!", "Crownseeker!"), ("Pilgrim,", "Crownseeker,"),
]
PATTERNS = [(re.compile(r"(?<![A-Za-z])" + re.escape(a) + r"(?![A-Za-z])"), b) for a, b in PHRASES]

# a JS/TS/JSON string literal ('…', "…", `…`; escapes kept), or a comment (passed over untouched)
TOKEN = re.compile(r"""//[^\n]*|/\*.*?\*/|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`""", re.S)


def rename(text: str) -> str:
    for p, b in PATTERNS:
        text = p.sub(b, text)
    return text


def process(src: str) -> str:
    def one(m: re.Match) -> str:
        tok = m.group(0)
        if tok.startswith("//") or tok.startswith("/*"):
            return tok
        return tok[0] + rename(tok[1:-1]) + tok[-1]
    return TOKEN.sub(one, src)


if __name__ == "__main__":
    for path in sys.argv[1:]:
        with open(path, encoding="utf-8", newline="") as f:
            src = f.read()
        out = process(src)
        if out != src:
            with open(path, "w", encoding="utf-8", newline="") as f:
                f.write(out)
            print("renamed", path)
