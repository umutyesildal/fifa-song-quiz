import QuizContainer from '../components/QuizContainer';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen py-6">
      <Head>
        <title>FIFA Song Quiz</title>
        <meta name="description" content="Test your knowledge of FIFA soundtrack songs daily!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto py-8 px-4">
        <QuizContainer />
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-500">
        FIFA Song Quiz &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}