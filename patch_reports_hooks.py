with open('src/hooks/queries/useReports.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("import { useQuery } from '@tanstack/react-query';", "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';")
text = text.replace("import { fetchReports, GetReportsParams } from '../../lib/api/endpoints/reports';", "import { fetchReports, GetReportsParams, fetchReportById, deleteReport, updateReport } from '../../lib/api/endpoints/reports';")

new_hooks = """
export const useGetReportById = (id: number | string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['report', id],
        queryFn: () => fetchReportById(id),
        enabled: enabled && !!id,
    });
};

export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

export const useUpdateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: number | string, formData: FormData }) => updateReport(id, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['report', variables.id] });
        },
    });
};
"""

text += "\n" + new_hooks

with open('src/hooks/queries/useReports.ts', 'w', encoding='utf-8') as f:
    f.write(text)
