#!/usr/bin/env python3
"""
Investor Data Seeding Script

This script populates the database with sample investor data for development and testing.
Can be run directly or imported and used in other scripts.

Usage:
    python -m app.scripts.seed_investors
"""

import json
import sys
from typing import List

from sqlmodel import Session, create_engine

from app.core.config import settings
from app.crud.investor import create_investor_profile
from app.crud.user import create_user, get_user_by_email
from app.models.investor import InvestorProfileCreate
from app.models.startup import FundingStage, Industry
from app.models.user import UserCreate, UserRole

# Sample investor data with valid enum values
SAMPLE_INVESTORS = [
    {
        "name": "Sarah Chen",
        "email": "sarah.chen@accelventures.com",
        "firm_name": "Accel Ventures",
        "bio": "Early-stage investor with 8+ years experience in SaaS and fintech. Former product manager at Stripe.",
        "website": "https://accelventures.com",
        "location": "San Francisco, CA",
        "linkedin_url": "https://linkedin.com/in/sarahchen",
        "twitter_url": "https://twitter.com/sarahchen_vc",
        "investment_focus": [Industry.FINTECH, Industry.TECHNOLOGY],
        "preferred_stages": [FundingStage.SEED, FundingStage.SERIES_A],
    },
    {
        "name": "David Rodriguez",
        "email": "david@techstars.com",
        "firm_name": "Techstars",
        "bio": "Managing Director at Techstars with focus on enterprise software and B2B marketplaces.",
        "website": "https://techstars.com",
        "location": "Austin, TX",
        "linkedin_url": "https://linkedin.com/in/davidrodriguez",
        "investment_focus": [Industry.TECHNOLOGY, Industry.FINTECH],
        "preferred_stages": [FundingStage.PRE_SEED, FundingStage.SEED],
    },
    {
        "name": "Emily Watson",
        "email": "emily.watson@foundercollective.com",
        "firm_name": "Founder Collective",
        "bio": "Partner focused on consumer technology and mobile apps. Former founder of successful e-commerce startup.",
        "website": "https://foundercollective.com",
        "location": "Boston, MA",
        "linkedin_url": "https://linkedin.com/in/emilywatson",
        "twitter_url": "https://twitter.com/emily_watson",
        "investment_focus": [Industry.RETAIL, Industry.ECOMMERCE, Industry.TECHNOLOGY],
        "preferred_stages": [FundingStage.SEED, FundingStage.SERIES_A],
    },
    {
        "name": "Michael Kim",
        "email": "michael@nea.com",
        "firm_name": "New Enterprise Associates",
        "bio": "Principal at NEA specializing in healthcare technology and biotech investments.",
        "website": "https://nea.com",
        "location": "Menlo Park, CA",
        "linkedin_url": "https://linkedin.com/in/michaelkim",
        "investment_focus": [
            Industry.HEALTHCARE,
            Industry.BIOTECHNOLOGY,
            Industry.HEALTH_TECH,
        ],
        "preferred_stages": [FundingStage.SERIES_A, FundingStage.SERIES_B],
    },
    {
        "name": "Jessica Liu",
        "email": "jessica@greylock.com",
        "firm_name": "Greylock Partners",
        "bio": "Investment partner with expertise in AI/ML and developer tools. PhD in Computer Science from Stanford.",
        "website": "https://greylock.com",
        "location": "Palo Alto, CA",
        "linkedin_url": "https://linkedin.com/in/jessicaliu",
        "twitter_url": "https://twitter.com/jessica_liu_vc",
        "investment_focus": [Industry.TECHNOLOGY, Industry.TELECOMMUNICATIONS],
        "preferred_stages": [
            FundingStage.SEED,
            FundingStage.SERIES_A,
            FundingStage.SERIES_B,
        ],
    },
    {
        "name": "Robert Thompson",
        "email": "robert@firstround.com",
        "firm_name": "First Round Capital",
        "bio": "Founding partner with 15+ years in venture capital. Focus on marketplace and platform businesses.",
        "website": "https://firstround.com",
        "location": "Philadelphia, PA",
        "linkedin_url": "https://linkedin.com/in/robertthompson",
        "investment_focus": [Industry.ECOMMERCE, Industry.TECHNOLOGY, Industry.RETAIL],
        "preferred_stages": [FundingStage.PRE_SEED, FundingStage.SEED],
    },
    {
        "name": "Anna Kowalski",
        "email": "anna@indexventures.com",
        "firm_name": "Index Ventures",
        "bio": "European venture capitalist specializing in fintech and sustainable technology investments.",
        "website": "https://indexventures.com",
        "location": "London, UK",
        "linkedin_url": "https://linkedin.com/in/annakowalski",
        "investment_focus": [Industry.FINTECH, Industry.ENERGY, Industry.TECHNOLOGY],
        "preferred_stages": [FundingStage.SERIES_A, FundingStage.SERIES_B],
    },
    {
        "name": "James Park",
        "email": "james@sparkventures.com",
        "firm_name": "Spark Ventures",
        "bio": "Former tech executive turned investor. Focuses on early-stage B2B SaaS and productivity tools.",
        "website": "https://sparkventures.com",
        "location": "Seattle, WA",
        "linkedin_url": "https://linkedin.com/in/jamespark",
        "twitter_url": "https://twitter.com/james_park_vc",
        "investment_focus": [Industry.TECHNOLOGY, Industry.TELECOMMUNICATIONS],
        "preferred_stages": [FundingStage.PRE_SEED, FundingStage.SEED],
    },
    {
        "name": "Lisa Zhang",
        "email": "lisa@lightspeedvp.com",
        "firm_name": "Lightspeed Venture Partners",
        "bio": "Partner with background in enterprise software and cybersecurity. Former CTO at security startup.",
        "website": "https://lightspeedvp.com",
        "location": "San Jose, CA",
        "linkedin_url": "https://linkedin.com/in/lisazhang",
        "investment_focus": [
            Industry.CYBERSECURITY,
            Industry.TECHNOLOGY,
            Industry.TELECOMMUNICATIONS,
        ],
        "preferred_stages": [FundingStage.SERIES_A, FundingStage.SERIES_B],
    },
    {
        "name": "Marcus Johnson",
        "email": "marcus@andreessen.com",
        "firm_name": "Andreessen Horowitz",
        "bio": "General partner focusing on crypto, web3, and decentralized technologies. Author of blockchain investment thesis.",
        "website": "https://a16z.com",
        "location": "Menlo Park, CA",
        "linkedin_url": "https://linkedin.com/in/marcusjohnson",
        "twitter_url": "https://twitter.com/marcus_a16z",
        "investment_focus": [Industry.FINTECH, Industry.TECHNOLOGY],
        "preferred_stages": [FundingStage.SEED, FundingStage.SERIES_A],
    },
]


def create_database_engine():
    """Create database engine using app settings."""
    if not settings.SQLALCHEMY_DATABASE_URL:
        raise ValueError("Database URL not configured")
    return create_engine(str(settings.SQLALCHEMY_DATABASE_URL))


def seed_investor(session: Session, investor_data: dict) -> tuple[bool, str]:
    """
    Seed a single investor into the database.

    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Check if user already exists
        existing_user = get_user_by_email(db=session, email=investor_data["email"])

        if existing_user:
            if existing_user.role != UserRole.INVESTOR:
                return (
                    False,
                    f"User {investor_data['email']} exists but is not an investor",
                )

            # Check if investor profile exists
            from sqlmodel import select

            from app.models.investor import InvestorProfile

            existing_profile = session.exec(
                select(InvestorProfile).where(
                    InvestorProfile.user_id == existing_user.id
                )
            ).first()

            if existing_profile:
                return (
                    False,
                    f"Investor profile for {investor_data['email']} already exists",
                )

            investor_user = existing_user
        else:
            # Create new user
            user_create = UserCreate(
                full_name=investor_data["name"],
                email=investor_data["email"],
                password="temp_password_123!",  # Temporary password
                role=UserRole.INVESTOR,
            )
            investor_user = create_user(db=session, user_create=user_create)
            if investor_user:
                investor_user.is_verified = True
                session.add(investor_user)
                session.commit()

        # Create investor profile
        profile_data = InvestorProfileCreate(
            firm_name=investor_data["firm_name"],
            bio=investor_data.get("bio"),
            website=investor_data.get("website"),
            location=investor_data.get("location"),
            linkedin_url=investor_data.get("linkedin_url"),
            twitter_url=investor_data.get("twitter_url"),
            investment_focus=investor_data.get("investment_focus", []),
            preferred_stages=investor_data.get("preferred_stages", []),
        )

        create_investor_profile(
            db=session, investor_profile_in=profile_data, user_id=investor_user.id
        )

        return True, f"Created investor profile for {investor_data['name']}"

    except Exception as e:
        return (
            False,
            f"Failed to create investor {investor_data.get('name', 'Unknown')}: {str(e)}",
        )


def seed_investors(investors_data: List[dict] | None = None) -> dict:
    """
    Seed multiple investors into the database.

    Args:
        investors_data: List of investor dictionaries. If None, uses SAMPLE_INVESTORS.

    Returns:
        dict: Results summary with counts and any errors
    """
    if investors_data is None:
        investors_data = SAMPLE_INVESTORS

    engine = create_database_engine()
    results = {"total": len(investors_data), "created": 0, "skipped": 0, "errors": []}

    with Session(engine) as session:
        for investor_data in investors_data:
            success, message = seed_investor(session, investor_data)

            if success:
                results["created"] += 1
                print(f"✓ {message}")
            else:
                results["skipped"] += 1
                results["errors"].append(message)
                print(f"⚠ {message}")

    return results


def main():
    """Main function for command-line usage."""
    import argparse

    parser = argparse.ArgumentParser(description="Seed investor data into the database")
    parser.add_argument(
        "--file", "-f", type=str, help="JSON file containing investor data"
    )

    args = parser.parse_args()

    print("🌱 Starting investor data seeding...")

    if args.file:
        print(f"📁 Loading investors from {args.file}")
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Handle both list of investors and wrapper object
            if isinstance(data, dict) and "investors" in data:
                investors_data = data["investors"]
            elif isinstance(data, list):
                investors_data = data
            else:
                print(
                    "❌ JSON file must contain a list of investors or an object with 'investors' key"
                )
                sys.exit(1)

        except Exception as e:
            print(f"❌ Error loading JSON file: {e}")
            sys.exit(1)
    else:
        print("📋 Using default sample investor data")
        investors_data = SAMPLE_INVESTORS

    # Seed the investors
    results = seed_investors(investors_data)

    # Print summary
    print("\n" + "=" * 50)
    print("📊 SEEDING SUMMARY")
    print("=" * 50)
    print(f"Total investors processed: {results['total']}")
    print(f"Successfully created: {results['created']}")
    print(f"Skipped (already exist): {results['skipped']}")
    print(f"Errors: {len(results['errors'])}")

    if results["errors"]:
        print("\n❌ ERRORS:")
        for error in results["errors"]:
            print(f"  • {error}")

    if results["created"] > 0:
        print(f"\n✅ Successfully seeded {results['created']} investors!")
    else:
        print("\n⚠️  No new investors were created.")


if __name__ == "__main__":
    main()
