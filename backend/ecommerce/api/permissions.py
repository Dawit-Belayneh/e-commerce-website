from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, or OPTIONS requests (Read-only)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the author of the review
        return obj.user == request.user