from pathlib import Path
import re,json
root=Path('src')
p=root/'components/layout/portal-shell.tsx';s=p.read_text().replace('    setPage(p);\n','');pos=s.index('  useEffect(() => {\n    if (toast)')
s=s[:pos]+'''  useEffect(()=>{if(ready&&s.role&&portal&&portal!==s.role)router.replace('/'+s.role)},[ready,s.role,portal,router]);
'''+s[pos:];p.write_text(s)
# Actual domain-owned form schemas, consumed by the shared form renderer.
p=root/'components/forms/record-fields.ts';s=p.read_text();a=s.index('export const fields:');b=s.index('export const numeric')
block=s[a:b];entries=re.findall(r'\b(\w+):\s*(\[[\s\S]*?\]),?',block)
imports=[];mapping=[]
for name,arr in entries:
 feature={'products':'inventory'}.get(name,name);path=root/f'features/{feature}/schema.ts';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(f'export const {name}Fields={arr};\n');imports.append(f"import {{{name}Fields}} from '@/features/{feature}/schema';");mapping.append(f'{name}:{name}Fields')
p.write_text("import {type Collection} from '@/types';\n"+'\n'.join(imports)+'\nexport const fields:Partial<Record<Collection,string[]>>={'+','.join(mapping)+'};\n'+s[b:])
# Remove unused import symbols reported by the strict compiler.
removals={'components/forms/record-detail.tsx':['Download'],'components/forms/record-management.tsx':['Search','minutes','commission'],'features/appointments/components/appointments-screen.tsx':['Search','Check'],'features/commissions/selectors.ts':['today'],'features/memberships/actions.ts':['RecordData'],'features/payments/actions.ts':['RecordData'],'features/payments/components/customer-payment.tsx':['label'],'features/payments/components/receipt-view.tsx':['Download'],'features/pos/components/pos-screen.tsx':['Wallet','commission','label'],'features/staff/components/schedule-screen.tsx':['label']}
pattern=r'import\s*\{([^}]+)\}\s*from\s*([\'\"][^\'\"]+[\'\"]);?'
for path,names in removals.items():
 p=root/path;s=p.read_text()
 def clean(m):
  kept=[x.strip() for x in m.group(1).split(',') if x.strip() and x.strip().removeprefix('type ') not in names]
  return 'import {'+', '.join(kept)+'} from '+m.group(2)+';' if kept else ''
 p.write_text(re.sub(pattern,clean,s,flags=re.S))
p=root/'features/payments/actions.ts';s=p.read_text().replace('  const amount = total - Number(invoice?.amount || 0);\n','');p.write_text(s)
p=root/'features/payments/components/customer-payment.tsx';s=p.read_text().replace('  const { db, save } = useERP();\n','');p.write_text(s)
p=Path('package.json');d=json.loads(p.read_text());d['scripts']['lint']='tsc --noEmit --noUnusedLocals --noUnusedParameters';p.write_text(json.dumps(d,indent=2))
