# Système de profils multiples

## 1. Base de données (migration)

Table `family_profiles` :
- `id` uuid PK
- `owner_id` uuid (référence l'utilisateur titulaire, NOT NULL)
- `linked_user_id` uuid nullable (compte du membre si invité)
- `first_name`, `last_name` text
- `relationship` text (conjoint/enfant/parent/autre)
- `invite_email` text nullable
- `invite_token` text nullable (unique, pour lien d'invitation)
- `invite_status` text (`pending` / `accepted` / `none`), default `none`
- `passport_data` jsonb default `'{}'`
- `is_self` boolean default false (profil principal du titulaire)
- `created_at`, `updated_at` timestamptz

GRANT + RLS :
- Owner: SELECT/INSERT/UPDATE/DELETE où `owner_id = auth.uid()`
- Membre lié: SELECT où `linked_user_id = auth.uid()`
- Acceptation invitation : policy UPDATE permettant à l'invité (auth.uid() correspondant à l'email) de lier son `linked_user_id` + passer status à `accepted`

Trigger `handle_new_user` mis à jour : créer automatiquement un `family_profiles` avec `is_self=true` pour le nouvel utilisateur.

## 2. Limites par plan (frontend)

```ts
const PROFILE_LIMITS = { free: 1, solo: 2, serenity: 3, family: 5 };
const NEXT_PLAN = { free: 'solo', solo: 'serenity', serenity: 'family' };
```

Hook `useFamilyProfiles()` :
- `profiles` (liste)
- `limit` (selon plan)
- `canAdd` boolean
- `addProfile(mode, data)`, `updateProfile`, `deleteProfile`
- `sendInvite(email, relationship, firstName)` → invoque edge function `send-profile-invite`

## 3. Pages / composants

- **Nouvelle page** `src/pages/MyProfiles.tsx` (route `/my-profiles`)
  - Header avec compteur (`X / Y profils`)
  - Grille de cartes : initiales colorées, prénom/nom, relation, badge "Invitation en attente" / "Complet" / "Incomplet"
  - Bouton "+" → ouvre `AddProfileDialog`
  - Si limite atteinte → bouton grisé + `UpgradePromptDialog`
- **`src/components/profiles/AddProfileDialog.tsx`** : tabs "Je gère moi-même" / "Inviter"
- **`src/components/profiles/UpgradePromptDialog.tsx`** : modale upgrade
- **`src/pages/ProfilePassport.tsx`** (route `/my-profiles/:profileId`) : passeport d'un profil secondaire avec bannière "Passeport de X — géré par Y", réutilise `Dashboard` sections avec props injectées (data source = `family_profiles.passport_data` au lieu de `passports`)
- **Menu hamburger** : ajouter entrée "Mes profils"
- **Page Profil** : ajouter lien "Mes profils"

## 4. Sections disponibles selon plan
Filtre la liste des sections sur la page passeport d'un profil secondaire selon `plan` (free/solo/serenity/family).

## 5. Invitations par email

Edge function `send-profile-invite` (utilise Resend déjà configuré) :
- input : `profileId`, `inviteEmail`, `firstName`, `ownerName`
- crée/maj `invite_token`, envoie email avec lien `/accept-invite?token=...`

Page `src/pages/AcceptInvite.tsx` :
- Lit `token`, demande connexion/inscription
- Une fois connecté : appelle RPC `accept_profile_invite(token)` qui set `linked_user_id = auth.uid()` et `invite_status='accepted'`

## 6. Fichiers
- created: migration SQL, `useFamilyProfiles.tsx`, `MyProfiles.tsx`, `ProfilePassport.tsx`, `AcceptInvite.tsx`, `AddProfileDialog.tsx`, `UpgradePromptDialog.tsx`, `ProfileCard.tsx`, edge function `send-profile-invite/index.ts`
- edited: `App.tsx` (routes), `Header.tsx` (menu), `Profile.tsx` (lien)

Note technique : le passeport principal reste dans la table `passports` existante. Les profils secondaires utilisent `family_profiles.passport_data` (jsonb unique). Cela évite une migration lourde du modèle existant.
