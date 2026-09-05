const API_BASE_URL = "/api";
let refreshPromise = null;

function shouldRefresh(endpoint, status) {
  return (
    status === 401 &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/refresh" &&
    endpoint !== "/auth/logout"
  );
}

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    ).finally(() => {
      refreshPromise = null;
    });
  }

  const response = await refreshPromise;

  if (!response.ok) {
    throw new Error("Session expired. Please sign in again.");
  }
}

async function request(
  endpoint,
  options = {},
  retry = true,
) {
  const {
    method = "GET",
    body,
    headers = {},
  } = options;

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    result = {
      success: false,
      message: "Invalid server response",
    };
  }

  if (!response.ok) {
    if (retry && shouldRefresh(endpoint, response.status)) {
      await refreshSession();
      return request(endpoint, options, false);
    }

    const error = new Error(
      result.message ||
        "Something went wrong"
    );

    error.status = response.status;
    throw error;
  }

  return result;
}

export const api = {
  get(endpoint) {
    return request(endpoint);
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body,
    });
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: "PUT",
      body,
    });
  },

  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};

export default api;