import { Note } from '../api/notes';
import { useDeleteNote } from '../hooks/useNotes';
import styles from './NoteCard.module.scss';

interface Props {
  note: Note;
}

export function NoteCard({ note }: Props) {
  const deleteNote = useDeleteNote();

  return (
    <article className={styles.card}>
      <header>
        <h3>{note.title}</h3>
        <button
          className={styles.delete}
          onClick={() => deleteNote.mutate(note.id)}
          disabled={deleteNote.isPending}
          aria-label={`Delete note ${note.title}`}
        >
          ×
        </button>
      </header>
      <p className={styles.content}>{note.content}</p>
      <time className={styles.timestamp} dateTime={note.createdAt}>
        {new Date(note.createdAt).toLocaleString()}
      </time>
    </article>
  );
}
