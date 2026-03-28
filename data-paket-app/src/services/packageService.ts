import { apiClient } from "./api";
import type { Package } from "../types";

interface GetPackagesParams {
    page?: number,
    limit?: number,
    provider?: string,
    minPrice?: number,
    maxPrice?: number,
    minQuota?: number,
    maxQuota?: number,
    search?: string,
}

export const packageService = {
    async getPackages(params: GetPackagesParams={}): Promise<{ data: Package[]; total: number }> {
        const { page = 1, limit = 8, provider, minPrice, maxPrice, minQuota, maxQuota, search} = params;
        
        const queryParams: string[] = [];

        if (provider && provider !=='all') queryParams.push(`provider=${provider}`);
        if (search) queryParams.push(`name_like=${search}`);

        const response = await apiClient.get(`/packages?${queryParams.join('&')}`);
        let data: Package[] = response.data;

        if (minPrice !== undefined && minPrice > 0) data = data.filter(p => p.price >= minPrice);
        if (maxPrice !== undefined && maxPrice > 0) data = data.filter(p => p.price <= maxPrice);
        if (minQuota !== undefined && minQuota > 0) data = data.filter(p => p.quota >= minQuota);
        if (maxQuota !== undefined && maxQuota > 0) data = data.filter(p => p.quota >= maxQuota);

        const total = data.length;
        const start = (page - 1) * limit;
        const paginatedData = data.slice(start, start + limit);

        return {data: paginatedData, total};
    },

    async getPackageById(id: string): Promise<Package> {
        const response = await apiClient.get(`/packages/${id}`);
        return response.data;
    },

    async getFeaturedPackages(): Promise<Package[]> {
        const response = await apiClient.get(`/packages?popular=true`);
        return response.data.slice(0,4);
    },
};