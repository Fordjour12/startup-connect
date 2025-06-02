#!/usr/bin/env python3
"""
Test script to demonstrate auto-login after user registration.

This script shows how the registration endpoint now returns both user data
and an access token for immediate authentication.
"""

import requests
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
TEST_USER = {
    "email": f"test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "role": "founder",
}


def test_auto_login_registration():
    """Test the auto-login registration flow."""
    print("🚀 Testing Auto-Login Registration Flow")
    print("=" * 50)

    # Step 1: Register new user
    print(f"📧 Registering user: {TEST_USER['email']}")

    registration_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "role": TEST_USER["role"],
    }

    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=registration_data,
            headers={"Content-Type": "application/json"},
        )

        if response.status_code == 201:
            result = response.json()
            print("✅ Registration successful!")
            print(f"👤 User ID: {result['user']['id']}")
            print(f"📛 Full Name: {result['user']['full_name']}")
            print(f"🔑 Access Token: {result['access_token'][:20]}...")
            print(f"💬 Message: {result['message']}")

            # Step 2: Test the access token
            print("\n🔐 Testing Access Token...")

            auth_headers = {
                "Authorization": f"Bearer {result['access_token']}",
                "Content-Type": "application/json",
            }

            # Test protected endpoint
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=auth_headers)

            if me_response.status_code == 200:
                user_data = me_response.json()
                print("✅ Access token works!")
                print(f"👤 Authenticated as: {user_data['full_name']}")
                print(f"📧 Email: {user_data['email']}")
                print(f"🏷️ Role: {user_data['role']}")

                return True
            else:
                print(f"❌ Access token test failed: {me_response.status_code}")
                print(me_response.text)
                return False

        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(response.text)
            return False

    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server.")
        print("💡 Make sure the server is running: uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def test_traditional_login():
    """Test traditional login flow for comparison."""
    print("\n🔄 Testing Traditional Login Flow (for comparison)")
    print("=" * 50)

    # Use form data for OAuth2 compatibility
    login_data = {
        "username": TEST_USER["email"],  # OAuth2 uses 'username' field
        "password": TEST_USER["password"],
    }

    try:
        response = requests.post(
            f"{BASE_URL}/auth/login/access-token",
            data=login_data,  # Use data instead of json for form data
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        if response.status_code == 200:
            result = response.json()
            print("✅ Traditional login successful!")
            print(f"🔑 Access Token: {result['access_token'][:20]}...")
            print(f"🔖 Token Type: {result['token_type']}")
            return True
        else:
            print(f"❌ Traditional login failed: {response.status_code}")
            print(response.text)
            return False

    except Exception as e:
        print(f"❌ Traditional login error: {e}")
        return False


def demo_user_flows():
    """Demonstrate different user registration flows."""
    print("\n📋 User Flow Comparison")
    print("=" * 50)

    print("🚀 **AUTO-LOGIN FLOW:**")
    print("   1. User fills registration form")
    print("   2. POST /auth/register")
    print("   3. ✅ User immediately logged in with token")
    print("   4. 🎯 Redirect to dashboard")
    print("   5. 📧 Email verification sent (background)")

    print("\n🔄 **TRADITIONAL FLOW:**")
    print("   1. User fills registration form")
    print("   2. POST /auth/register")
    print("   3. 📧 Email verification sent")
    print("   4. User checks email and clicks link")
    print("   5. 🔗 Verification page")
    print("   6. User logs in manually")
    print("   7. ✅ Access granted")

    print("\n📊 **BENEFITS OF AUTO-LOGIN:**")
    print("   ✅ 50% fewer steps for user")
    print("   ✅ Higher conversion rates")
    print("   ✅ Better user experience")
    print("   ✅ Immediate engagement")
    print("   ✅ Email verification in background")


if __name__ == "__main__":
    print("🧪 StartupConnect Auto-Login Test Suite")
    print("=" * 60)

    # Run the tests
    auto_login_success = test_auto_login_registration()

    if auto_login_success:
        traditional_login_success = test_traditional_login()
        demo_user_flows()

        print("\n🎉 **TEST SUMMARY:**")
        print(
            f"   Auto-login Registration: {'✅ PASS' if auto_login_success else '❌ FAIL'}"
        )
        print(
            f"   Traditional Login: {'✅ PASS' if traditional_login_success else '❌ FAIL'}"
        )

        if auto_login_success and traditional_login_success:
            print("\n🚀 **RESULT:** Auto-login implementation successful!")
            print("   Users can now register and immediately start using the app! 🎯")

    else:
        print("\n💡 **TROUBLESHOOTING:**")
        print("   1. Start the server: uvicorn app.main:app --reload")
        print("   2. Check server logs for errors")
        print("   3. Verify database connection (optional for testing)")
        print("   4. Check if port 8000 is available")
