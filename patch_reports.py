import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add useGetReports import
text = text.replace('import autoTable from "jspdf-autotable";', 'import autoTable from "jspdf-autotable";\nimport { useGetReports } from "@/hooks/queries/useReports";')

old_component_start = '''const Reports = () => {
  const { lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");'''

new_component_start = '''const Reports = () => {
  const { lang, isRTL } = useLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data: reportsData, isLoading, isError } = useGetReports({ pageNumber: page, pageSize });
  
  // Map API response to UI Report model
  const reports: Report[] = (reportsData?.data || []).map(r => ({
    id: r.id,
    title: r.itemName,
    category: "Electronics", // Default category if not provided by API
    location: "Unknown", // Default location if not provided
    date: r.dateReported.split("T")[0],
    status: r.reportType === 1 ? "lost" : "found",
    reporter: "System User", // Default reporter
    hasMatch: false,
    description: r.description || "No description provided",
    imagePath: r.imagePath
  }));

  const [searchQuery, setSearchQuery] = useState("");'''

text = text.replace(old_component_start, new_component_start)

# Update toggleAll to use the dynamically mapped reports
text = text.replace('''const toggleAll = () => {
    if (selectedRows.size === filtered.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map((r) => r.id)));
  };''', '''const toggleAll = () => {
    if (selectedRows.size === filtered.length && filtered.length > 0) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map((r) => r.id.toString())));
  };''')

# Now find where toggleRow is and ensure it uses toString() if id is number
text = text.replace('const toggleRow = (id: string)', 'const toggleRow = (id: string | number)')
text = text.replace('const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id);', 'const idStr = id.toString(); const next = new Set(prev); if (next.has(idStr)) next.delete(idStr); else next.add(idStr);')
text = text.replace('selectedRows.has(report.id)', 'selectedRows.has(report.id.toString())')
text = text.replace('selectedRows.has(r.id)', 'selectedRows.has(r.id.toString())')


with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
