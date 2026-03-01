import {useState, useEffect} from 'react';
import API from '../api/axios';

function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        API.get('categories/')
            .then((res) =>{
                setCategories(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching categories:', err);
                setLoading(false);
            });
    }, []);

    return { categories, loading };
}

export default useCategories;