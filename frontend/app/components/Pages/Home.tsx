"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { Post } from "../Post";

import Spinner from "../Spinner";
import CreateNews from "../Forms/createNews";

interface Post {
  avatar: string;
  banner: string;
  comments: [any];
  createdAt: string;
  likes: [any];
  name: string;
  text: string;
  title: string;
  userName: string;
  _id: string;
}

// const PostsList = () => {
//   const { nextUrl, previousUrl, data, totalPosts } = useStore();

//   const [posts, setPosts] = useState(data);

//   const postsPorPagina = 5;

//   const [currentPage, setCurrentPage] = useState(1);

//   // Calcula o número total de páginas
//   const [totalPages, setTotalPages] = useState<number | null>(null);

//   useEffect(() => {
//     if (totalPosts) {
//       setTotalPages(Math.ceil(totalPosts / postsPorPagina));
//     }
//   }, [totalPosts]);

//   // Atualiza os posts a serem exibidos com base na página atual
//   const paginatedPosts = posts.slice(
//     (currentPage - 1) * postsPorPagina,
//     currentPage * postsPorPagina
//   );

//   // Atualiza os posts (simulação de dados)
//   useEffect(() => {
//     // Lógica para carregar os posts (pode ser uma chamada à API, etc.)
//     // Substitua esta lógica pelo método real de obter seus posts
//     const fetchPosts = async () => {
//       // Simulação de dados, você substituirá isso com sua lógica real de obtenção de dados
//       const response = await fetch(
//         "https://jsonplaceholder.typicode.com/posts"
//       );
//       const data = await response.json();
//       setPosts(data);
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div>
//       {/* Renderiza a lista de posts na página atual */}
//       <ul>
//         {paginatedPosts.map((post) => (
//           <li key={post._id}>{post.title}</li>
//         ))}
//       </ul>

//       {/* Renderiza a navegação de páginas */}
//       <div>
//         <p>
//           Página {currentPage} de {totalPages}
//         </p>
//         <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
//           Anterior
//         </button>
//         <button
//           onClick={() =>
//             setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//           }
//         >
//           Próxima
//         </button>
//       </div>
//     </div>
//   );
// };

const Alert = (props: { status: string; text: string }) => {
  const { status, text } = props;

  const [killAlert, setKillAlert] = useState<boolean>(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setKillAlert(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  return (
    <div className="w-screen h-40 rounded-md fixed flex items-center pl-4">
      <div className="w-80 h-[90%] bg-green-200 border border-green-300 flex rounded-md flex flex-col gap-4">
        <span className="ml-4 mt-4 text-green-600 font-bold">SUCESSO!</span>
        <div className="w-full h-full flex border-t border-green-300 items-center">
          <p className="ml-4 text-sm text-green-500 font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const {
    user,
    data,
    loading,
    fetchData,
    createIsOpen,
    setCreateIsOpen,
    updateIsOpen,
    setUpdateIsOpen,
  } = useStore();

  const router = useRouter();

  const [load, setLoad] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoad(true);
    setCreateIsOpen(false);
    setUpdateIsOpen(false);
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <main className="flex flex-col min-h-screen h-fit bg-white justify-start items-center relative">
      {showAlert && <Alert status="OK" text="teste Sucesso" />}

      {load === true && (
        <>
          <div className="w-[50%] h-full flex flex-col items-center gap-4 p-2 relative">
            <div className="w-full py-4 h-fit border border-slate-300 rounded-md flex">
              <div className="w-[20%] flex justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
                  <div
                    className="rounded-full w-[90%] h-[90%]"
                    style={{
                      backgroundImage: `url(${user?.avatar})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col w-[80%] justify-start items-start">
                <div
                  onClick={() => setCreateIsOpen(true)}
                  className="cursor-pointer w-[90%] border border-slate-300 bg-zinc-100 h-10 rounded-md flex items-center pl-4 transition-colors hover:bg-zinc-200"
                >
                  <span className="font-medium text-zinc-600 text-sm">
                    Criar publicação
                  </span>
                </div>
              </div>
            </div>
            {loading === false ? (
              data.map((post: Post) => {
                return <Post _id={post._id} key={post._id} />;
              })
            ) : (
              <Spinner />
            )}
            <div className="w-full bg-red-500 h-10">
              <h1>teste</h1>
            </div>
          </div>
          {createIsOpen && <CreateNews />}
        </>
      )}
    </main>
  );
}
