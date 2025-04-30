import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/ratings';

export const createRating = async (ratingData) => {
    try {
        const response = await axios.post(API_BASE_URL, ratingData);
        return response.data;
    } catch (error) {
        console.error('Error creating rating:', error);
        throw error;
    }
};

export const updateRating = async (ratingData) => {
    try {
        const response = await axios.put(API_BASE_URL, ratingData);
        return response.data;
    } catch (error) {
        console.error('Error updating rating:', error);
        throw error;
    }
};

export const deleteRating = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error('Error deleting rating:', error);
        throw error;
    }
};

export const getAverageRating = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/average/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting average rating:', error);
        return 0;
    }
};