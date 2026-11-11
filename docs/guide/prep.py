# Turns the screenshots in shots/ into the guide's pictures in img/: whole shots as JPEG 2000 px wide, the phone
# shots as they are, and crops. A crop is (shot, x0, y0, x1, y1) in CSS px of a shot taken at 2x; the marker and
# label positions in guide.html are in the same CSS px, so a crop that moves takes them with it.
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
S, O = os.path.join(HERE, 'shots'), os.path.join(HERE, 'img')
os.makedirs(O, exist_ok=True)

FULL = ['first', 'guide', 'inspect', 'apart', 'sheets', 'showme', 'explode', 'desk', 'greyscale', 'blueprint', 'hologram']
PHONE = ['phone', 'phone-inspect', 'phone-more']
CROPS = {
    'bar': ('apart', 150, 98, 856, 168),        # the inspect bar's two rows, without the step's caption
    'menu': ('views', 285, 470, 492, 715),      # the view buttons and the Views menu
    'tooltip': ('hover', 560, 470, 960, 660),
    'term': ('term', 964, 64, 1264, 470),
    'controls': ('controls', 964, 64, 1264, 784),
    'sources': ('sources', 964, 64, 1264, 520),
    'triad': ('first', 852, 62, 954, 164),
    'hero': ('first', 248, 168, 955, 706),      # the cover: the model alone, on the view's ground, as wide as the box
    'select': ('select', 290, 60, 953, 720),    # the view only, with the coils selected
    'wheel': ('wheel', 16, 64, 540, 620),       # the groups' wheel with the magnets fanned out
    'joint': ('joint', 61, 66, 953, 782),       # the view only, without the panels
    'tour': ('tour', 168, 60, 1264, 700),
    'quiz': ('quiz', 47, 60, 953, 720),
    # The control desk's monitor in three states: VIDEO 1, its options and what the tracking reads.
    'desk-glow': ('desk-glow', 980, 294, 1248, 548),
    'desk-tf': ('desk', 980, 294, 1248, 548),
    'desk-pf': ('desk-pf', 980, 294, 1248, 548),
}
PHOTO = {'select', 'wheel', 'joint', 'tour', 'quiz'}               # crops with much of the model in them go as JPEG

def shot(n):
    return Image.open(os.path.join(S, f'{n}.png')).convert('RGB')

for n in FULL:
    im = shot(n)
    im.resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS).save(os.path.join(O, f'{n}.jpg'), quality=86)
for n in PHONE:
    shot(n).save(os.path.join(O, f'{n}.jpg'), quality=88)
for n, (s, x0, y0, x1, y1) in CROPS.items():
    im = shot(s).crop((x0 * 2, y0 * 2, x1 * 2, y1 * 2))
    if n in PHOTO:
        im.save(os.path.join(O, f'{n}-crop.jpg'), quality=86)
    else:
        im.save(os.path.join(O, f'{n}.png'))
print(len(os.listdir(O)), 'pictures in', O)
