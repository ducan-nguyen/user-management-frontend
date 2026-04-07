import api from "./api";

class UserService {
  async getAll(page = 0, size = 10) {
    try {
      const response = await api.get("/users", {
        params: {
          page: page,
          size: size,
          sort: "id,asc",
          _t: Date.now(),
        },
      });
      console.log(`Get all - page ${page}, size ${size}:`, response.data);
      return response.data;
    } catch (error) {
      console.error("Get all error:", error.response?.data);
      throw error;
    }
  }

  // Thêm method để lấy tổng số users
  async getTotalCount() {
    try {
      const response = await api.get("/users", {
        params: {
          page: 0,
          size: 1,
          _t: Date.now(),
        },
      });
      return {
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("Get total count error:", error);
      throw error;
    }
  }

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async create(userData) {
    try {
      console.log("Creating user with data:", userData);
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Create error:", error.response?.data);
      
      // Xử lý specific cho lỗi 409 Conflict
      if (error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || "Username already exists";
        throw {
          status: 409,
          message: errorMessage,
          field: "username",
          isConflict: true
        };
      }
      
      // Các lỗi khác
      throw error.response?.data || {
        status: error.response?.status || 500,
        message: "Something went wrong"
      };
    }
  }

  async update(id, userData) {
    try {
      // Chỉ gửi các field được phép update
      const updateData = {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        role: userData.role,
      };

      console.log("Sending update data:", updateData);
      const response = await api.put(`/users/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Update error:", error.response?.data);
      throw error;
    }
  }

  async delete(id) {
    await api.delete(`/users/${id}`);
  }

  async updateStatus(id, status) {
    const response = await api.patch(`/users/${id}/status?status=${status}`);
    return response.data;
  }

  async search(keyword) {
    const response = await api.get(`/users/search?keyword=${keyword}`);
    return response.data;
  }

  // Thêm method kiểm tra username tồn tại
  async checkUsernameExists(username) {
    try {
      // Giả sử backend có endpoint check username
      const response = await api.get(`/users/check-username`, {
        params: { username }
      });
      return response.data.exists;
    } catch (error) {
      // Nếu không có endpoint check, có thể search và kiểm tra
      console.error("Check username error:", error);
      return false;
    }
  }
}

export default new UserService();