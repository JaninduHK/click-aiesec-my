# AIESEC Malaysia Link Shortener

Official URL shortening service for AIESEC Malaysia. Create short, branded links for campaigns, events, and opportunities with comprehensive analytics tracking.

[![click.aiesec.my](https://www.aiesec.org/images/aiesec-logo.png)](https://click.aiesec.my)

## 🚀 Overview

**click.aiesec.my** is a custom-built link shortening platform designed specifically for AIESEC Malaysia's needs. It provides:

- **Custom Short URLs**: Create branded links with memorable slugs (e.g., `click.aiesec.my/gv2024`)
- **Real-time Analytics**: Track clicks, geographic distribution, referrers, and device types
- **User Management**: Role-based access control with USER and ADMIN roles
- **Link Management**: Full CRUD operations for managing shortened links
- **Visual Analytics**: Charts and graphs showing click trends and engagement metrics

## ✨ Key Features

### For All Users
- Create custom short links with personalized slugs
- View detailed analytics for each link (clicks over time, geographic data, referrers)
- Copy shortened URLs with one click
- Edit link destinations and titles
- Activate/deactivate links without deleting them
- Profile management with LC and designation fields

### For Administrators
- Manage all users and their links
- View system-wide analytics and statistics
- User role management (promote/demote users)
- Delete users and their associated links
- Access comprehensive dashboard with all links across the system

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Custom components based on TailAdmin dashboard
- **Charts**: Custom chart components for analytics visualization

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/click.aiesec.my.git
cd click.aiesec.my
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to React 19 peer dependency issues with some packages.

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aiesec_shortener"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Short Domain (production)
NEXT_PUBLIC_SHORT_DOMAIN="https://click.aiesec.my"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses the following main models:

- **User**: User accounts with authentication and profile information
- **ShortLink**: Shortened links with slug, destination, and metadata
- **ClickEvent**: Click tracking with IP, country, device, and referrer data

## 🚀 Deployment

### Recommended Platform: Vercel

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Database: Neon or Supabase

For production PostgreSQL hosting, we recommend:
- [Neon](https://neon.tech) - Serverless Postgres
- [Supabase](https://supabase.com) - Open source Firebase alternative

## 📱 Key Pages

- **/** - Landing page with hero section
- **/signin** - User authentication
- **/dashboard** - Main dashboard with analytics overview
- **/dashboard/shortner** - Create new short links
- **/dashboard/links** - Manage all your links
- **/dashboard/links/[id]** - Detailed analytics for a specific link
- **/dashboard/charts** - Visual analytics and charts
- **/dashboard/profile** - User profile management
- **/dashboard/users** - User management (Admin only)

## 🔐 Authentication & Authorization

- Built with NextAuth.js for secure authentication
- Role-based access control (USER, ADMIN)
- Session management with JWT
- Password hashing with bcryptjs
- Protected API routes and pages

## 📈 Analytics Features

Each shortened link provides:
- Total all-time clicks
- Clicks in the last 24 hours
- Clicks in the last 7 days
- Daily click trends (last 30 days)
- Top referrer sources
- Geographic distribution by country
- Device type breakdown
- Recent click events with timestamps

## 🎨 Design System

- Primary brand color: `#037EF3` (AIESEC Blue)
- Clean, modern dashboard interface
- Responsive design for mobile and desktop
- Dark mode support
- Consistent spacing and typography using Tailwind CSS

## 📝 API Routes

### Public Routes
- `GET /api/auth/*` - NextAuth authentication endpoints

### Protected Routes (Authenticated Users)
- `GET /api/shortlinks` - Get all user's links
- `POST /api/shortlinks` - Create a new short link
- `GET /api/shortlinks/[id]` - Get specific link details
- `PATCH /api/shortlinks/[id]` - Update a link
- `DELETE /api/shortlinks/[id]` - Delete a link

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create a new user
- `DELETE /api/admin/users/[id]` - Delete a user

## 🤝 Contributing

This is a private project for AIESEC Malaysia. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Dashboard design inspired by [TailAdmin](https://tailadmin.com)
- Icons and branding from [AIESEC Brand Guidelines](https://aies.ec/bluebook)

## 📞 Support

For issues or questions:
- Contact the AIESEC Malaysia tech team
- Email: tech@aiesec.my

---

**Made with ❤️ for AIESEC Malaysia**
