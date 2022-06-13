import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  CommunityState,
  Community,
  CommunitySnippet,
} from '../atoms/communitiesAtom';

import { authModal } from '../atoms/authModalAtom';
import { auth, firestore } from '../firebase/client';
import { useRouter } from 'next/router';

const useCommunityData = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityState);
  const setAuthModalState = useSetRecoilState(authModal);

  const onJoinOrLeave = (communityData: Community, isJoined: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    setError('');
    try {
      const snippetsDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`),
      );
      const snippets = snippetsDocs.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log({ error: error.message });
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id,
        ),
        newSnippet,
      );

      batch.update(doc(firestore, 'communities', communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log('Error Join Community : ', error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId),
      );

      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId,
        ),
      }));
    } catch (error: any) {
      console.log('Error Leave Community : ', error?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) getMySnippets();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({ ...prev, mySnippets: [] }));
    }
  }, [user]);

  const fetchCommunityData = async (communityId: string) => {
    try {
      const communityRef = doc(firestore, 'communities', communityId);
      const communityDoc = await getDoc(communityRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log('fetchPost Error :', error.message);
    }
  };

  useEffect(() => {
    const { communityId } = router.query;
    if (communityId && !communityStateValue.currentCommunity) {
      fetchCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    setCommunityStateValue,
    onJoinOrLeave,
    loading,
  };
};
export default useCommunityData;
