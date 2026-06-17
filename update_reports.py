import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Report type
text = re.sub(r'type Report = \{.*?\};', '''export interface Report {
  id: string | number;
  title: string;
  category: string;
  location: string;
  date: string;
  status: "lost" | "found";
  reporter: string;
  hasMatch: boolean;
  description: string;
  imagePath?: string;
}''', text, flags=re.DOTALL)

# Delete hardcoded reports
text = re.sub(r'const reports: Report\[\] = \[.*?\];', '', text, flags=re.DOTALL)

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
