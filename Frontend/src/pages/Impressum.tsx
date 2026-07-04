import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';

const Impressum = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Impressum
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Angaben gemäß § 5 DDG
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Verantwortlich
          </Typography>
          <Typography variant="body1">
            Son Hai Vu
            <br />
            Stuttgarter Str. 134
            <br />
            73312 Geislingen
            <br />
            Deutschland
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Kontakt
          </Typography>
          <Typography variant="body1">
            Telefon: +49 152 37349594
            <br />
            E-Mail:{' '}
            <a href="mailto:haidepzai.solutions@gmail.com" style={{ color: 'inherit' }}>
              haidepzai.solutions@gmail.com
            </a>
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Tätigkeit
          </Typography>
          <Typography variant="body1">Softwareentwicklung sowie Betrieb eines Online-Portfolios und einer Web-Anwendung.</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Umsatzsteuer
          </Typography>
          <Typography variant="body1">Es wird keine Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG angegeben.</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </Typography>
          <Typography variant="body1">
            Son Hai Vu
            <br />
            Remser Str. 1
            <br />
            70736 Fellbach
            <br />
            Deutschland
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Haftung für Inhalte
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
            kann jedoch keine Gewähr übernommen werden.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Haftung für Links
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte kein Einfluss besteht. Für diese fremden Inhalte wird
            daher keine Gewähr übernommen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Urheberrecht
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Impressum;
