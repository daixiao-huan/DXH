// 模拟Supabase客户端
const supabase = {
  auth: {
    getSession: () => ({
      data: {
        session: null
      }
    }),
    onAuthStateChange: (callback: any) => {
      // 模拟回调调用
      callback(null, null);
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async () => ({
      error: null
    }),
    signUp: async () => ({
      error: null
    }),
    signOut: async () => {}
  },
  from: (table: string) => ({
    select: function(columns: string) {
      return {
        eq: function(column: string, value: any) {
          return {
            single: async () => ({
              data: null,
              error: null
            }),
            order: function(column: string, options: any) {
              return {
                async: async () => ({
                  data: [],
                  error: null
                })
              };
            },
            async: async () => ({
              data: [],
              error: null
            })
          };
        },
        order: function(column: string, options: any) {
          return {
            async: async () => ({
              data: [],
              error: null
            })
          };
        },
        async: async () => ({
          data: [],
          error: null
        })
      };
    },
    insert: async (data: any) => ({
      error: null
    }),
    update: function(data: any) {
      return {
        eq: function(column: string, value: any) {
          return {
            async: async () => ({
              error: null
            })
          };
        }
      };
    }
  })
};

export { supabase };