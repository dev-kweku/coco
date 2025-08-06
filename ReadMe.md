# Create Next.js project
npx create-next-app@14.2 courier-gh --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd courier-gh

# Install shadcn/ui
npx shadcn@latest init
# Follow prompts to set up shadcn/ui (choose default options)

# Install additional dependencies
npm install @next/font lucide-react class-variance-authority clsx tailwind-merge mongoose bcryptjs jsonwebtoken paystack axios