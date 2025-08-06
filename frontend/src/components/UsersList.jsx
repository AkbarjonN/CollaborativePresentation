export default function UsersList({ users, socket, myRole }) {
    const isCreator = myRole === 'creator';
  
    const toggleRole = (userId, currentRole) => {
      const newRole = currentRole === 'viewer' ? 'editor' : 'viewer';
      socket.emit('change-role', { userId, newRole });
    };
  
    return (
      <div className="bg-white border-start p-2" style={{ width: '220px' }}>
        <h6 className="mb-3">Users</h6>
        <ul className="list-group">
          {users.map((user) => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span className="fw-bold">{user.nickname}</span>
                {' '}
                {user.role === 'creator' && '👑'}
                {user.role === 'editor' && '✏️'}
                {user.role === 'viewer' && '👁️'}
              </div>
              {isCreator && user.role !== 'creator' && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => toggleRole(user.id, user.role)}
                >
                  ⇆
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }