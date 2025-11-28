import { auth, db, storage } from '../firebase/config';

function FirebaseConnectTest() {
  // Firebase 연결 테스트
  console.log('Firebase Auth:', auth);
  console.log('Firebase Firestore:', db);
  console.log('Firebase Storage:', storage);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Firebase 연결 테스트</h1>
      <p>개발자 도구 콘솔을 확인하세요!</p>
      <ul>
        <li>Auth: {auth ? '✅ 연결됨' : '❌ 실패'}</li>
        <li>Firestore: {db ? '✅ 연결됨' : '❌ 실패'}</li>
        <li>Storage: {storage ? '✅ 연결됨' : '❌ 실패'}</li>
      </ul>
    </div>
  );
}

export default FirebaseConnectTest;