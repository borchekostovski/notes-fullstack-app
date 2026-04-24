import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateNoteInput, notesApi } from '../api/notes';

const NOTES_KEY = ['notes'] as const;

export function useNotes() {
  return useQuery({ queryKey: NOTES_KEY, queryFn: notesApi.list });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNoteInput) => notesApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}
