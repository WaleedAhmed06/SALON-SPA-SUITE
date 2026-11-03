from pathlib import Path
root=Path('src')
source=(root/'components/modules.tsx').read_text()
header=source[:source.index('const mapping:')].replace('"./calendar-board"','"@/components/calendar/calendar-board"').replace('"./ui/button"','"@/components/ui/button"')
def region(start,end):return source[source.index(start):source.index(end)]
def write(path,text):
 p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
shared='''\nimport {Modal} from '@/components/ui/modal';
import {Status} from '@/components/ui/status-badge';
import {label} from '@/lib/labels';
'''
write(Path('components/ui/modal.tsx'),header+region('export function Modal','function Status'))
write(Path('components/ui/status-badge.tsx'),'export '+region('function Status','export function Modules'))
write(Path('lib/labels.ts'),'export '+region('const label =','export function Modal'))
write(Path('components/forms/assignment.tsx'),header+'export '+source[source.index('function Assignment'):])
write(Path('components/forms/record-fields.ts'),"import {type Collection} from '@/lib/data';\n"+region('const fields:','const label =').replace('const fields:','export const fields:').replace('const numeric =','export const numeric ='))
records_imports=shared+"import {fields,numeric} from './record-fields';\nimport {Assignment} from './assignment';\nimport {RecordDetail} from './record-detail';\n"
write(Path('components/forms/record-management.tsx'),header+records_imports+'export '+region('function Records','function RecordDetail'))
write(Path('components/forms/record-detail.tsx'),header+shared+'export '+region('function RecordDetail','function Appointments'))
screens=[('appointments','appointments-screen','function Appointments','function CustomerPay'),('payments','customer-payment','function CustomerPay','type Line ='),('pos','pos-screen','function POS','function ReceiptView'),('payments','receipt-view','function ReceiptView','function Commissions'),('commissions','commissions-screen','function Commissions','function Schedule'),('staff','schedule-screen','function Schedule','function Notifications'),('notifications','notifications-screen','function Notifications','function Reports'),('reports','reports-screen','function Reports','function Profile'),('customers','profile-screen','function Profile','function Assignment')]
line=region('type Line =','function POS').replace('type Line =','export type Line =')
write(Path('features/pos/types.ts'),line)
extra="""import {CustomerPay} from '@/features/payments/components/customer-payment';
import {ReceiptView} from '@/features/payments/components/receipt-view';
import {type Line} from '@/features/pos/types';
"""
for feature,file,start,end in screens:
 text=header+shared
 if feature=='appointments':text+="import {CustomerPay} from '@/features/payments/components/customer-payment';\n"
 if file in ['pos-screen','profile-screen']:text+="import {ReceiptView} from '@/features/payments/components/receipt-view';\n"
 if file in ['pos-screen','receipt-view']:text+="import {type Line} from '@/features/pos/types';\n"
 write(Path(f'features/{feature}/components/{file}.tsx'),text+'export '+region(start,end))
imports='''"use client";
import {type Collection,type Role} from '@/lib/data';
import {Records} from '@/components/forms/record-management';
'''
for feature,file,start,end in screens:
 if start in ['function CustomerPay','function ReceiptView']:continue
 name=start.split()[1]
 imports+=f"import {{{name}}} from '@/features/{feature}/components/{file}';\n"
write(Path('components/layout/module-router.tsx'),imports+region('const mapping:','const fields:')+region('export function Modules','function Records'))
# Dashboard and layout composition are separate from business modules.
app=(root/'components/erp-app.tsx').read_text();imports=app[:app.index('const navItems =')]
imports=imports.replace('"@/components/modules"','"@/components/layout/module-router"').replace('"@/components/insights"','"@/features/dashboard/components/insights"').replace('"@/components/assistant"','"@/features/chatbot/components/assistant"')
dashboard=app[app.index('function Dashboard('):app.index('function Module(')]
write(Path('features/dashboard/components/dashboard-screen.tsx'),imports+'\n'+app[app.index('function Badge('):app.index('function Dashboard(')]+ 'export '+dashboard)
app=imports+'\nimport {Dashboard} from "@/features/dashboard/components/dashboard-screen";\n'+app[app.index('const navItems ='):app.index('function Badge(')]+app[app.index('function Module('):]
write(Path('components/layout/portal-shell.tsx'),app)
# Move existing components to the meaningful shared/feature paths.
for old,new in [('components/insights.tsx','features/dashboard/components/insights.tsx'),('components/assistant.tsx','features/chatbot/components/assistant.tsx'),('components/calendar-board.tsx','components/calendar/calendar-board.tsx')]:
 p=root/new;p.parent.mkdir(parents=True,exist_ok=True);text=(root/old).read_text().replace('"./ui/button"','"@/components/ui/button"');p.write_text(text);(root/old).unlink()
for old in ['components/modules.tsx','components/erp-app.tsx']:(root/old).unlink()
for p in (root/'app').rglob('*.tsx'):p.write_text(p.read_text().replace('@/components/erp-app','@/components/layout/portal-shell'))
# Keep stable compatibility imports while moving ownership of data/state.
data=(root/'lib/data.ts').read_text();types=data[:data.index('export const today')];helpers=data[data.index('export const today'):data.index('const names =')];seed=data[data.index('const names ='):data.index('export type Database')]
write(Path('types/index.ts'),types+"\nimport type {seed} from '@/data/seed';\nexport type Database=ReturnType<typeof seed>;\nexport type Collection=keyof Database;\n")
write(Path('lib/format.ts'),"import {type Role} from '@/types';\n"+helpers)
write(Path('data/seed.ts'),"import {type RecordData} from '@/types';\nimport {today} from '@/lib/format';\n"+seed)
write(Path('lib/data.ts'),"// Compatibility exports. New modules import from types, data, or format directly.\nexport * from '@/types';\nexport {seed} from '@/data/seed';\nexport * from '@/lib/format';\n")
store=(root/'lib/store.ts').read_text().replace('"./data"','"@/lib/data"');write(Path('store/erp-store.ts'),store);write(Path('lib/store.ts'),"export {useERP} from '@/store/erp-store';\n")
# Fix relative button imports after moving feature components.
for p in root.rglob('*.tsx'):
 text=p.read_text().replace('"./ui/button"','"@/components/ui/button"');p.write_text(text)
