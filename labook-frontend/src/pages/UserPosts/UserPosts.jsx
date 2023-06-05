import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import axios from '../../api/axios';
import { Link, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Conteiner = styled.div`
  display: flex;
  width: 100%;
`;

const NewPostInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;


// Componente da barra lateral de navegação
const Sidebar = styled.div`
  width: 188px;
  background-color: #f5f8fa;
  padding: 20px;
  height: 100vh;
  position: fixed;
`;

// Componente do item de menu na barra lateral
const SidebarItem = styled.a`
  display: block;
  margin-bottom: 10px;
  color: #1da1f2;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// Componente da seção "home" com as postagens
const HomeSection = styled.div`
  /* margin-left: 280px; Considerando a largura da barra lateral */
  padding: 20px;
  width: 100%;
  margin-left: 188px;
`;

// Componente de uma postagem
const Post = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: black;
`;

// Componente do ícone de like/dislike
const LikeDislikeIcon = styled.span`
  margin-right: 5px;
  cursor: pointer;
`;

// Componente da página principal
const UserPosts = () => {

  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const reversedPosts = [...posts].reverse()
  console.log(posts)
  console.log(reversedPosts)
  const {auth} = useAuth()
  const {username} = useParams()
  // ...

  useEffect(() => {
    // Lógica para buscar a lista de posts do backend e atualizar o estado
    const fetchPosts = async () => {
      try {
        const user = await axios.get('users/finduser', {
          params: {
            q: 'Leo2'
          }
        })
        console.log(user)
        const response = await axios.get('/posts/getposts', {
          creatorId: user.id
        });
        console.log(response)
        if (response) { 
          const data = await response.data.posts;
          setPosts(data); // ver se o caminho é esse mesmo
        } else {
          console.log('Falha ao buscar a lista de posts');
        }
      } catch (error) {
        console.log('Erro ao buscar a lista de posts:', error);
      }
    };

    fetchPosts();
  }, []); // Executa apenas uma vez, durante a montagem do componente

  // Função para lidar com o clique no ícone de like
  const handleLikeClick = async (postId) => {
    // /likes/likedislike like é pra enviar 1, dislike envia 0
    // Implemente a lógica de atualização do like no estado ou no backend
    console.log(`Like na postagem ${postId}`);
    try {
      const response = await axios.post('/likes/likedislike', {
        postId,
        userId: '77aca5b7-62a9-41f9-8973-cae6145a8bae',
        likedislike: 1
      });
  
      if (response.status === 200) {
        console.log(response)
        // Atualize o número de likes na postagem localmente
        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: response.data.likesdislikeoutput.likes,
              dislikes: response.data.likesdislikeoutput.dislikes

            };
          }
          return post;
        });
        setPosts(updatedPosts);
      } else {
        console.log('Erro ao enviar o like');
      }
    } catch (error) {
      console.log('Erro ao enviar o like:', error);
    }
  };

  // Função para lidar com o clique no ícone de dislike
  const handleDislikeClick = async (postId) => {
    // Implemente a lógica de atualização do dislike no estado ou no backend
    console.log(`Dislike na postagem ${postId}`);
    try {
      const response = await axios.post('/likes/likedislike', {
        postId,
        userId: '77aca5b7-62a9-41f9-8973-cae6145a8bae',
        likedislike: 0
      });
  
      if (response.status === 200) {
        console.log(response)
        // Atualize o número de likes na postagem localmente
        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: response.data.likesdislikeoutput.likes,
              dislikes: response.data.likesdislikeoutput.dislikes

            };
          }
          return post;
        });
        setPosts(updatedPosts);
      } else {
        console.log('Erro ao enviar o like');
      }
    } catch (error) {
      console.log('Erro ao enviar o like:', error);
    }
  };

  return (
    <Conteiner>
      <Sidebar>
        <SidebarItem><Link to="/">Home</Link></SidebarItem>
        <SidebarItem> <Link to={`/userposts/${auth.name}`}>Meus Posts</Link></SidebarItem>
        <SidebarItem>Admin</SidebarItem>
      </Sidebar>
      <HomeSection>
        {reversedPosts.map((post) => (
          <Post key={post.id}>
            <p>{post.name}</p>
            <p>{post.content}</p>
            <p>{post.created_at}</p>
            <div>
              <LikeDislikeIcon onClick={() => handleLikeClick(post.id)}>
                👍 {post.likes}
              </LikeDislikeIcon>
              <LikeDislikeIcon onClick={() => handleDislikeClick(post.id)}>
                👎 {post.dislikes}
              </LikeDislikeIcon>
            </div>
          </Post>
        ))}
      </HomeSection>
    </Conteiner>
  );
};

export default UserPosts