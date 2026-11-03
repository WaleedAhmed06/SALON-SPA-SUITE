from pathlib import Path
import re
root=Path('src');s=(root/'lib/business.ts').read_text()
starts=list(re.finditer(r'^export (?:function|const|type) (\w+)',s,re.M));parts={}
for i,m in enumerate(starts):parts[m.group(1)]=s[m.start():starts[i+1].start() if i+1<len(starts) else len(s)]
base='import {type Database,type RecordData,today} from "@/lib/data";\n'
def write(path,text):p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
write('lib/time.ts',parts['minutes']+parts['timeString']+parts['inCalendarRange'])
write('lib/export.ts',parts['exportFile'].replace('export function','import {type RecordData} from "@/types";\nexport function',1))
write('features/appointments/actions.ts',base+'import {minutes,timeString} from "@/lib/time";\n'+''.join(parts[n] for n in ['slots','validateBooking','completeAppointment','bookAppointment']))
write('features/commissions/selectors.ts',base+'import {type SaleLine} from "@/features/pos/types";\n'+parts['commission'])
write('features/pos/actions.ts',base+'import {type SaleLine} from "./types";\n'+parts['paymentTotals']+parts['settleSale'])
write('features/memberships/actions.ts',base+parts['purchaseMembership'])
write('features/payments/actions.ts',base+parts['payAppointment'])
p=root/'features/pos/types.ts';p.write_text(p.read_text()+'\nexport type SaleLine=Line;\n')
write('lib/business.ts','''// Stable compatibility surface; business rules are owned by their features.
export * from '@/lib/time';
export * from '@/lib/export';
export * from '@/features/appointments/actions';
export * from '@/features/commissions/selectors';
export * from '@/features/pos/actions';
export * from '@/features/memberships/actions';
export * from '@/features/payments/actions';
export type {SaleLine} from '@/features/pos/types';
''')
p=root/'lib/reports.ts';write('features/reports/selectors.ts',p.read_text().replace('"./data"','"@/lib/data"').replace('"./business"','"@/features/commissions/selectors"'));p.write_text("export {reportNames,reportRows} from '@/features/reports/selectors';\n")
# Prune generated broad named imports; feature modules only depend on what they use.
pattern=r'import\s*\{([^}]+)\}\s*from\s*([\'\"][^\'\"]+[\'\"]);?'
for p in root.rglob('*.tsx'):
 text=p.read_text();body=re.sub(pattern,'',text,flags=re.S)
 def prune(m):
  kept=[]
  for spec in m.group(1).split(','):
   spec=spec.strip()
   if not spec:continue
   local=spec.split(' as ')[-1].removeprefix('type ').strip()
   if re.search(r'\b'+re.escape(local)+r'\b',body):kept.append(spec)
  return 'import {'+', '.join(kept)+'} from '+m.group(2)+';' if kept else ''
 text=re.sub(pattern,prune,text,flags=re.S)
 p.write_text(text)
