import { apiFetch } from "./api";

const BASE=import.meta.env.VITE_ADMIN_SERVICE_URL;

export const adminService={
    getUsers: async()=>{
        return await
    apiFetch(`${BASE}/api/admin/users`);
    },
    deleteUser: async(id)=>{
        await
    apiFetch(`${BASE}/api/admin/users/${id}`,
        {method:'DELETE'});
    },
    changeRole: async (id,role)=>{
        await
        apiFetch(`${BASE}/api/admin/users/${id}/role`,
            {method:'PUT',
            body:JSON.stringify(role),
    });
    },
    getAllTrips:async ()=>{
        return await
        apiFetch(`${BASE}/api/admin/trips`);
    },
};