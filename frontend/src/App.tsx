import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import styles from './App.module.scss';

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Notes</h1>
        <p>A quiet place to jot things down.</p>
      </header>
      <main className={styles.main}>
        <NoteForm />
        <NoteList />
      </main>
    </div>
  );
}
