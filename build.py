from pathlib import Path
import re,json,hashlib
P=Path(__file__).parent
def inline(m):
 tag,name=m.groups();sub='scripts' if tag=='SCRIPT' else 'styles';text=(P/'src'/sub/name).read_text()
 if name=='topology-runtime.js':text=text.replace('TOPOLOGY_DATA',json.dumps(json.loads((P/'src/topology-v3.json').read_text()),separators=(',',':')))
 return text
html=re.sub(r'@@INLINE_(SCRIPT|STYLE):([^@]+)@@',inline,(P/'src/index.template.html').read_text())
(P/'dist').mkdir(exist_ok=True);(P/'dist/index.html').write_text(html)
print('dist/index.html',len(html.encode()),hashlib.sha256(html.encode()).hexdigest())
