import uuid


def generate_qr_data(registration_id):
    return {
        "registrationId": str(registration_id)
    }