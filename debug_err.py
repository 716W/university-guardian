import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('''      onError: () => {
        toast({ title: lang === "AR" ? "فشل التحديث" : "Update failed", variant: "destructive" });
      }''', '''      onError: (err: any) => {
        console.error("Update error:", err);
        toast({ title: lang === "AR" ? "فشل التحديث" : "Update failed: " + (err.response?.data?.message || err.message), variant: "destructive" });
      }''')
      
text = text.replace('''      onError: () => {
        toast({ title: lang === "AR" ? "فشل الحذف" : "Deletion failed", variant: "destructive" });
      }''', '''      onError: (err: any) => {
        console.error("Delete error:", err);
        toast({ title: lang === "AR" ? "فشل الحذف" : "Deletion failed: " + (err.response?.data?.message || err.message), variant: "destructive" });
      }''')

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
