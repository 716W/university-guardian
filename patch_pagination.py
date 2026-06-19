import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace showing text 
text = text.replace('''<p className="text-sm text-muted-foreground">
            {t("showing", lang)} {filtered.length} {t("of", lang)} {reports.length} {t("reports", lang).toLowerCase()}
            {selectedRows.size > 0 && <span className="ms-2 font-medium text-primary">({selectedRows.size} {t("selected", lang)})</span>}
          </p>''', '''<p className="text-sm text-muted-foreground">
            {t("showing", lang)} {filtered.length} {t("of", lang)} {reportsData?.totalRecords || reports.length} {t("reports", lang).toLowerCase()}
            {selectedRows.size > 0 && <span className="ms-2 font-medium text-primary">({selectedRows.size} {t("selected", lang)})</span>}
          </p>''')

# Replace pagination buttons
old_pagination = '''<div className="flex gap-1">
            <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">{t("previous", lang)}</button>
            <button className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">1</button>
            <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">2</button>
            <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">{t("next", lang)}</button>
          </div>'''

new_pagination = '''<div className="flex gap-1">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
              {t("previous", lang)}
            </button>
            <button className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">{page}</button>
            <button 
              disabled={page >= (reportsData?.totalPages || 1)}
              onClick={() => setPage(p => p + 1)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
              {t("next", lang)}
            </button>
          </div>'''

text = text.replace(old_pagination, new_pagination)

# Add isLoading indicator check for the table
text = text.replace('''<div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>''', '''<div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>''')
            
# I'll just leave table, add a loading state in tbody if needed, or better just loading on the page.

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
