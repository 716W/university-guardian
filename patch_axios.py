with open('src/lib/api/endpoints/reports.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("""export const updateReport = async (id: number | string, formData: FormData): Promise<void> => {
    await apiClient.put(`/api/v1/reports/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};""", """export const updateReport = async (id: number | string, formData: FormData): Promise<void> => {
    await apiClient.put(`/api/v1/reports/${id}`, formData);
};""")

with open('src/lib/api/endpoints/reports.ts', 'w', encoding='utf-8') as f:
    f.write(text)
