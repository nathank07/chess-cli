package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var key = []byte("secret")

func generateJWT(id int) (string, error) {
	expirationTime := time.Now().Add(12 * time.Hour)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"exp": expirationTime.Unix(),
	})

	tokenString, err := token.SignedString(key)
	return tokenString, err
}

func sessionToJWT(ctx *gin.Context) (string, error) {
	session, err := store.Get(ctx.Request, "login-session")
	if err != nil {
		return "", err
	}
	id, ok := session.Values["id"].(int)
	if !ok {
		return "", err
	}
	return generateJWT(id)
}
