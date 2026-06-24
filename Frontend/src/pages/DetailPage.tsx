// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import ShopDetailView from '../components/DetailPage/ShopDetailView';
import DetailPageBG from '../components/DetailPage/DetailPageBG';

import '../css/DetailPage/DetailPage.css';
import { useParams } from 'react-router-dom';
import { getShop } from '../actions/ShopActions';

const DetailPage = () => {
  const { routeId } = useParams();

  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);

  const loadShop = useCallback(async () => {
    const shop = await getShop(routeId);
    setShop(shop);
  }, [routeId]);

  useEffect(() => {
    loadShop().finally(() => setLoading(false));
  }, [loadShop]);

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
