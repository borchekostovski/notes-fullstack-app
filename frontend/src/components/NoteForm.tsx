import { FormEvent, useState } from 'react';
import { useCreateNote } from '../hooks/useNotes';
import styles from './NoteForm.module.scss';

export function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createNote = useCreateNote();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await createNote.mutateAsync({ title: title.trim(), content: content.trim() });
    setTitle('');
    setContent('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.title}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={120}
        required
      />
      <textarea
        className={styles.content}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something…"
        rows={4}
        required
      />
      <div className={styles.actions}>
        {createNote.isError && (
          <span className={styles.error}>Couldn't save. Try again.</span>
        )}
        <button type="submit" disabled={createNote.isPending}>
          {createNote.isPending ? 'Saving…' : 'Add note'}
        </button>
      </div>
    </form>
  );
}
