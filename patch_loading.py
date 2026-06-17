import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add loading state in tbody
text = text.replace('''<tbody className="divide-y divide-border">
              {filtered.map((report) => (''', '''<tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    {t("loading", lang) || "Loading..."}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No reports found.
                  </td>
                </tr>
              ) : filtered.map((report) => (''')


with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
