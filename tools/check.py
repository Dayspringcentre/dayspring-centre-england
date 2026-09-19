from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

root = Path(__file__).resolve().parent.parent
errors=[]
class Check(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.path=path; self.h1=0; self.ids=[]; self.refs=[]; self.labels=[]; self.controls=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='h1': self.h1+=1
        if 'id' in a: self.ids.append(a['id'])
        if tag=='label' and 'for' in a: self.labels.append(a['for'])
        if tag in ('input','select','textarea') and a.get('type')!='checkbox': self.controls.append(a.get('id'))
        if tag=='img' and 'alt' not in a: errors.append(f'{self.path.name}: image without alt')
        for key in ('href','src'):
            ref=a.get(key,'')
            if ref.startswith('/') and not ref.startswith('//'):
                target=root / unquote(urlsplit(ref).path).lstrip('/')
                if ref=='/': target=root/'index.html'
                if not target.exists(): errors.append(f'{self.path.name}: missing {ref}')
            if ref.startswith('#'): self.refs.append(ref[1:])

for file in root.glob('*.html'):
    p=Check(file);p.feed(file.read_text(encoding='utf-8'))
    if p.h1!=1: errors.append(f'{file.name}: {p.h1} H1s')
    if len(p.ids)!=len(set(p.ids)): errors.append(f'{file.name}: duplicate ids')
    for ref in p.refs:
        if ref not in p.ids: errors.append(f'{file.name}: missing anchor {ref}')
    for control in p.controls:
        if control not in p.labels: errors.append(f'{file.name}: unlabelled control {control}')
json.loads((root/'vercel.json').read_text())
print(json.dumps({'pages':len(list(root.glob('*.html'))),'errors':errors},indent=2))
raise SystemExit(bool(errors))
