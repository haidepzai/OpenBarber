import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

const sections = [
  {
    title: '1. Geltungsbereich',
    content: `Diese Nutzungsbedingungen gelten für die Nutzung der Plattform OpenBarber (nachfolgend „Plattform"), die unter openbarber.vercel.app erreichbar ist. Betreiber der Plattform ist Son Hai Vu, Stuttgarter Str. 134, 73312 Geislingen (nachfolgend „Betreiber").

Mit der Registrierung oder Nutzung der Plattform erkennst du diese Nutzungsbedingungen an.`,
  },
  {
    title: '2. Leistungsbeschreibung',
    content: `OpenBarber ist eine Online-Plattform, die es Kunden ermöglicht, Termine bei Barbershops zu buchen, und Shopbetreibern, ihren Barbershop zu präsentieren sowie Buchungen zu verwalten. Die Plattform vermittelt lediglich den Kontakt zwischen Kunden und Shopbetreibern. Der Betreiber ist nicht Vertragspartei der zwischen Kunden und Shopbetreibern geschlossenen Vereinbarungen.`,
  },
  {
    title: '3. Registrierung und Nutzerkonto',
    content: `3.1 Die Nutzung bestimmter Funktionen setzt eine Registrierung voraus. Bei der Registrierung sind wahrheitsgemäße Angaben zu machen.

3.2 Du bist verpflichtet, deine Zugangsdaten vertraulich zu behandeln und keinen Dritten zugänglich zu machen. Bei Verdacht auf Missbrauch bist du verpflichtet, uns unverzüglich unter haidepzai.solutions@gmail.com zu informieren.

3.3 Pro Person ist nur ein Konto erlaubt.`,
  },
  {
    title: '4. Pflichten der Nutzer',
    content: `Du verpflichtest dich, die Plattform nicht zu missbräuchlichen Zwecken zu nutzen. Insbesondere ist es untersagt:

• Falsche oder irreführende Angaben zu machen
• Die Plattform für illegale Zwecke zu nutzen
• Andere Nutzer zu belästigen oder zu schädigen
• Automatisierte Anfragen (Bots, Scraper) zu verwenden
• Sicherheitsmechanismen der Plattform zu umgehen`,
  },
  {
    title: '5. Pflichten der Shopbetreiber',
    content: `Shopbetreiber sind verantwortlich für die Richtigkeit aller eingetragenen Informationen (Öffnungszeiten, Preise, Leistungen). Sie verpflichten sich, gebuchte Termine einzuhalten oder Kunden rechtzeitig zu informieren. Der Betreiber behält sich vor, Shops zu sperren, die gegen diese Bedingungen verstoßen oder durch Nutzer wiederholt negativ bewertet werden.`,
  },
  {
    title: '6. Bewertungen und Inhalte',
    content: `6.1 Nutzer können Bewertungen und Kommentare hinterlassen. Diese müssen wahrheitsgemäß und sachlich sein. Beleidigende, diskriminierende oder unwahre Inhalte sind untersagt.

6.2 Der Betreiber behält sich vor, Inhalte ohne Angabe von Gründen zu entfernen, die gegen diese Bedingungen verstoßen.

6.3 Mit dem Einstellen von Inhalten räumst du dem Betreiber ein nicht-exklusives, kostenloses Nutzungsrecht zur Darstellung auf der Plattform ein.`,
  },
  {
    title: '7. Verfügbarkeit und Änderungen',
    content: `Der Betreiber bemüht sich um eine möglichst hohe Verfügbarkeit der Plattform, übernimmt jedoch keine Garantie für einen ununterbrochenen Betrieb. Die Plattform befindet sich in der Beta-Phase; Änderungen, Einschränkungen oder eine Einstellung des Betriebs sind jederzeit möglich. Nutzer werden über wesentliche Änderungen per E-Mail oder durch einen Hinweis auf der Plattform informiert.`,
  },
  {
    title: '8. Haftungsausschluss',
    content: `8.1 Der Betreiber haftet nicht für die Richtigkeit der von Shopbetreibern eingetragenen Informationen.

8.2 Der Betreiber haftet nicht für Schäden, die durch die Nichterfüllung von Terminen oder sonstige Streitigkeiten zwischen Kunden und Shopbetreibern entstehen.

8.3 Eine Haftung des Betreibers für leichte Fahrlässigkeit ist – soweit gesetzlich zulässig – ausgeschlossen.`,
  },
  {
    title: '9. Kündigung und Sperrung',
    content: `Du kannst dein Konto jederzeit durch eine Nachricht an haidepzai.solutions@gmail.com löschen lassen. Der Betreiber ist berechtigt, Konten bei Verstößen gegen diese Nutzungsbedingungen ohne vorherige Ankündigung zu sperren oder zu löschen.`,
  },
  {
    title: '10. Datenschutz',
    content: `Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung, die unter /privacy-policy abrufbar ist.`,
  },
  {
    title: '11. Änderungen der Nutzungsbedingungen',
    content: `Der Betreiber behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern. Änderungen werden durch Veröffentlichung auf der Plattform oder per E-Mail bekannt gegeben. Die weitere Nutzung der Plattform nach Inkrafttreten der Änderungen gilt als Zustimmung.`,
  },
  {
    title: '12. Anwendbares Recht und Gerichtsstand',
    content: `Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist – soweit gesetzlich zulässig – Stuttgart.`,
  },
];

const TermsPage = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Nutzungsbedingungen
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Stand: Juli 2026
      </Typography>

      <Divider sx={{ my: 3 }} />

      {sections.map((section, i) => (
        <Box key={i} mb={4}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {section.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {section.content}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.disabled">
        Bei Fragen zu diesen Nutzungsbedingungen wende dich an:{' '}
        <a href="mailto:haidepzai.solutions@gmail.com" style={{ color: 'inherit' }}>
          haidepzai.solutions@gmail.com
        </a>
      </Typography>
    </Box>
  );
};

export default TermsPage;
