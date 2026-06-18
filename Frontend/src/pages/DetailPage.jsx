import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import ShopDetailView from '../components/DetailPage/ShopDetailView';
import DetailPageBG from '../components/DetailPage/DetailPageBG';

import '../css/DetailPage/DetailPage.css';
import { useParams } from 'react-router-dom';
import { getShop } from '../actions/EnterpriseActions';

const DetailPage = () => {
  const { routeId } = useParams();

  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);

  const loadShop = useCallback(async () => {
    const enterprise = await getShop(routeId);
    setShop(enterprise);
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
