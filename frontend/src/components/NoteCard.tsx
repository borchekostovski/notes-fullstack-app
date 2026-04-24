import { useState } from 'react';
import { Note } from '../api/notes';
import { useDeleteNote } from '../hooks/useNotes';
import styles from './NoteCard.module.scss';

interface Props {
  note: Note;
}

export function NoteCard({ note }: Props) {
  const [confirming, setConfirming] = useState(false);
  const deleteNote = useDeleteNote();

  return (
    <article className={styles.card}>
      <header>
        <h3>{note.title}</h3>
        {confirming ? (
          <div className={styles.confirm} role="group" aria-label="Confirm delete">
            <span className={styles.prompt}>Delete?</span>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => setConfirming(false)}
              disabled={deleteNote.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.confirmDelete}
              onClick={() => deleteNote.mutate(note.id)}
              disabled={deleteNote.isPending}
              autoFocus
            >
              {deleteNote.isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.delete}
            onClick={() => setConfirming(true)}
            aria-label={`Delete note ${note.title}`}
          >
            ×
          </button>
        )}
      </header>
      <p className={styles.content}>{note.content}</p>
      <time className={styles.timestamp} dateTime={note.createdAt}>
        {new Date(note.createdAt).toLocaleString()}
      </time>
    </article>
  );
}
