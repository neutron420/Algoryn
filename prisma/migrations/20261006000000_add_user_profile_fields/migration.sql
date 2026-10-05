-- AlterTable User to add profile fields
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'headline') THEN
        ALTER TABLE "User" ADD COLUMN "headline" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'bio') THEN
        ALTER TABLE "User" ADD COLUMN "bio" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'collegeOrCompany') THEN
        ALTER TABLE "User" ADD COLUMN "collegeOrCompany" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'location') THEN
        ALTER TABLE "User" ADD COLUMN "location" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'githubUrl') THEN
        ALTER TABLE "User" ADD COLUMN "githubUrl" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'linkedinUrl') THEN
        ALTER TABLE "User" ADD COLUMN "linkedinUrl" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'portfolioUrl') THEN
        ALTER TABLE "User" ADD COLUMN "portfolioUrl" TEXT;
    END IF;
END $$;
