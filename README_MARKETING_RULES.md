# Règles Métier & Formules - Module Marketing

Ce document détaille les règles de gestion, les indicateurs de performance (KPI) et les formules de calcul utilisées dans le module Marketing du CRM.

## 1. Reporting Global (`MarketingReporting`)

Le tableau de bord principal agrège les données de tous les canaux marketing pour donner une vue d'ensemble du ROI et de la performance.

### Indicateurs Clés (KPIs)

| Indicateur | Description | Formule de Calcul |
| :--- | :--- | :--- |
| **Revenu Généré** | Chiffre d'affaires total attribué aux campagnes marketing sur la période donnée. | `Somme(CA des ventes liées à une campagne)` |
| **Coût d'Acquisition (CAC)** | Coût moyen pour acquérir un nouveau client via les efforts marketing. | `(Dépenses Marketing Totales / Nombre de Nouveaux Clients)` |
| **Leads Qualifiés (MQL)** | Nombre de prospects ayant atteint un score de qualification suffisant (Marketing Qualified Lead). | `Nombre de leads avec statut = 'Qualifié' OU Score > X` |
| **Taux de Conversion Global** | Pourcentage de visiteurs ou prospects devenus clients. | `(Nombre de Ventes / Nombre Total de Visiteurs Uniques) * 100` |
| **ROI (Retour sur Investissement)** | Rentabilité des investissements marketing. | `((Revenu Généré - Coût Total Campagnes) / Coût Total Campagnes) * 100` |

---

## 2. Email Marketing (`EmailDashboard`)

Module de gestion des campagnes d'emailing (Newsletters, Promos, etc.).

### Indicateurs de Performance

| Indicateur | Description | Formule de Calcul |
| :--- | :--- | :--- |
| **Taux d'Ouverture** | Pourcentage de destinataires ayant ouvert l'email. | `(Nombre d'ouvertures uniques / (Emails Envoyés - Bounces)) * 100` |
| **Taux de Clic (CTR)** | Pourcentage de destinataires ayant cliqué sur un lien dans l'email. | `(Nombre de clics uniques / (Emails Envoyés - Bounces)) * 100` |
| **Taux de Bounces** | Pourcentage d'emails non livrés (adresse invalide, boîte pleine). | `(Nombre de Bounces / Nombre Total d'Emails Envoyés) * 100` |
| **Taux de Désabonnement** | Pourcentage de destinataires s'étant désinscrits suite à l'envoi. | `(Nombre de Désabonnements / (Emails Envoyés - Bounces)) * 100` |

### Règles de Gestion Campagne
*   **Brouillon** : Campagne en cours de création, non visible par les contacts.
*   **Planifié** : Envoi programmé à une date/heure future. La modification est bloquée X minutes avant l'envoi.
*   **Envoyé** : Campagne finalisée et distribuée. Les statistiques sont figées ou incrémentées en temps réel.

---

## 3. SMS Marketing (`SMSDashboard`)

Gestion des campagnes SMS pour les promotions flash ou notifications urgentes.

### Indicateurs de Performance

| Indicateur | Description | Formule de Calcul |
| :--- | :--- | :--- |
| **Taux de Délivrabilité** | Pourcentage de SMS reçus sur le terminal du destinataire. | `(SMS Accusés de réception / SMS Envoyés) * 100` |
| **Taux de Réponse** | Pourcentage de destinataires ayant répondu au SMS (si activé). | `(Nombre de Réponses / SMS Livrés) * 100` |
| **Coût par Envoi** | Coût unitaire moyen d'un SMS envoyé. | `Coût Total de la Campagne / Nombre de SMS Envoyés` |

---

## 4. Réseaux Sociaux (`SocialDashboard`)

Gestion des publications et analyse de l'engagement sur les plateformes sociales (LinkedIn, Facebook, Instagram).

### Indicateurs de Performance

| Indicateur | Description | Formule de Calcul |
| :--- | :--- | :--- |
| **Taux d'Engagement** | Niveau d'interaction de l'audience avec une publication. | `((Likes + Commentaires + Partages) / Vues Totales) * 100` |
| **Portée (Reach)** | Nombre de personnes uniques ayant vu la publication. | Donnée fournie par l'API du réseau social. |
| **Impressions (Vues)** | Nombre total de fois que la publication a été affichée. | Donnée fournie par l'API du réseau social. |

---

## 5. Landing Pages (`LandingList`)

Pages d'atterrissage pour la conversion des campagnes.

### Indicateurs de Performance

| Indicateur | Description | Formule de Calcul |
| :--- | :--- | :--- |
| **Visites Uniques** | Nombre de personnes différentes ayant visité la page. | `Count(Distinct VisitorIDs)` |
| **Taux de Conversion** | Pourcentage de visiteurs ayant rempli l'objectif (formulaire, clic bouton). | `(Nombre de Conversions / Nombre de Visites Uniques) * 100` |
