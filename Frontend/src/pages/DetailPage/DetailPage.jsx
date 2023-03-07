import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import ShopDetailView from './components/ShopDetailView';
import DetailPageBG from './components/DetailPageBG';

import '../../css/DetailPage/DetailPage.css';
import { useParams } from 'react-router-dom';
import { getShop } from '../../actions/EnterpriseActions';

const DetailPage = () => {
  const { routeId } = useParams();

  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);

  const loadShop = async () => {
    const shops = await getShop(routeId);
    setShop(shops);
  };

  useEffect(() => {
    loadShop().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log(shop);
  }, [shop]);

  return (
    <>
      {!loading && (
        <Box className="detailPage" sx={{ position: 'relative' }}>
          <DetailPageBG img={shop.logo} />
          <ShopDetailView shop={shop} />
        </Box>
      )}
    </>
  );
};

export default DetailPage;
