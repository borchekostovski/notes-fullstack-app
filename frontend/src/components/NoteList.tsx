import { useNotes } from '../hooks/useNotes';
import { NoteCard } from './NoteCard';
import styles from './NoteList.module.scss';

export function NoteList() {
  const { data, isLoading, isError, refetch } = useNotes();

  if (isLoading) return <p className={styles.muted}>Loading notes…</p>;

  if (isError) {
    return (
      <div className={styles.errorBox}>
        <p>Something went wrong loading your notes.</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!data?.length) {
    return <p className={styles.muted}>No notes yet. Start by adding one above.</p>;
  }

  return (
    <ul className={styles.list}>
      {data.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} />
        </li>
      ))}
    </ul>
  );
}
