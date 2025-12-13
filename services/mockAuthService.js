// Mock Authentication Service - Works without backend
// Stores data in localStorage for testing

const mockAuthService = {
  // Register new user
  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Get existing users
          const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          
          // Check if email already exists
          const emailExists = users.find(u => u.email === userData.email);
          if (emailExists) {
            reject({
              response: {
                status: 409,
                data: {
                  message: 'البريد الإلكتروني موجود مسبقاً',
                  errors: {
                    email: ['البريد الإلكتروني موجود مسبقاً']
                  }
                }
              }
            });
            return;
          }
          
          // Create new user
          const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role: userData.role || 'client',
            created_at: new Date().toISOString()
          };
          
          // Save user
          users.push({ ...newUser, password: userData.password });
          localStorage.setItem('mockUsers', JSON.stringify(users));
          
          // Generate mock token
          const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          
          // Return response
          resolve({
            data: {
              user: newUser,
              token: token,
              message: 'تم إنشاء الحساب بنجاح'
            }
          });
        } catch (error) {
          reject({
            response: {
              status: 500,
              data: {
                message: 'حدث خطأ في الخادم'
              }
            }
          });
        }
      }, 500); // Simulate network delay
    });
  },

  // Login user
  login: (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Get existing users
          const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          
          // Find user by email
          const user = users.find(u => u.email === credentials.email);
          
          if (!user) {
            reject({
              response: {
                status: 401,
                data: {
                  message: 'البريد الإلكتروني غير موجود'
                }
              }
            });
            return;
          }
          
          // Check password
          if (user.password !== credentials.password) {
            reject({
              response: {
                status: 401,
                data: {
                  message: 'كلمة المرور غير صحيحة'
                }
              }
            });
            return;
          }
          
          // Generate mock token
          const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          
          resolve({
            data: {
              user: userWithoutPassword,
              token: token,
              message: 'تم تسجيل الدخول بنجاح'
            }
          });
        } catch (error) {
          reject({
            response: {
              status: 500,
              data: {
                message: 'حدث خطأ في الخادم'
              }
            }
          });
        }
      }, 500);
    });
  },

  // Logout user
  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            message: 'تم تسجيل الخروج بنجاح'
          }
        });
      }, 300);
    });
  },

  // Get current user
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          resolve({
            data: JSON.parse(user)
          });
        } else {
          reject({
            response: {
              status: 401,
              data: {
                message: 'غير مصرح'
              }
            }
          });
        }
      }, 300);
    });
  },

  // Update profile
  updateProfile: (userId, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          const userIndex = users.findIndex(u => u.id === userId);
          
          if (userIndex === -1) {
            reject({
              response: {
                status: 404,
                data: {
                  message: 'المستخدم غير موجود'
                }
              }
            });
            return;
          }
          
          // Update user
          users[userIndex] = { ...users[userIndex], ...data };
          localStorage.setItem('mockUsers', JSON.stringify(users));
          
          // Update current user in localStorage
          const currentUser = JSON.parse(localStorage.getItem('user'));
          if (currentUser.id === userId) {
            const { password, ...updatedUser } = users[userIndex];
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          resolve({
            data: {
              user: users[userIndex],
              message: 'تم تحديث الملف الشخصي بنجاح'
            }
          });
        } catch (error) {
          reject({
            response: {
              status: 500,
              data: {
                message: 'حدث خطأ في الخادم'
              }
            }
          });
        }
      }, 500);
    });
  },

  // Change password
  changePassword: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          const userIndex = users.findIndex(u => u.id === currentUser.id);
          
          if (userIndex === -1) {
            reject({
              response: {
                status: 404,
                data: {
                  message: 'المستخدم غير موجود'
                }
              }
            });
            return;
          }
          
          // Check old password
          if (users[userIndex].password !== data.old_password) {
            reject({
              response: {
                status: 401,
                data: {
                  message: 'كلمة المرور القديمة غير صحيحة'
                }
              }
            });
            return;
          }
          
          // Update password
          users[userIndex].password = data.new_password;
          localStorage.setItem('mockUsers', JSON.stringify(users));
          
          resolve({
            data: {
              message: 'تم تغيير كلمة المرور بنجاح'
            }
          });
        } catch (error) {
          reject({
            response: {
              status: 500,
              data: {
                message: 'حدث خطأ في الخادم'
              }
            }
          });
        }
      }, 500);
    });
  },
};

export default mockAuthService;

