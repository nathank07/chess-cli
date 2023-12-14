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

func checkJWTexpiry(token *jwt.Token) bool {
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return true
	}
	exp, ok := claims["exp"].(float64)
	if !ok {
		return true
	}
	return (time.Now().Unix() - int64(1*time.Hour)) > int64(exp)
}

func handleToken(ctx *gin.Context) {
	if !checkIfTokenNeeded(ctx) {
		ctx.JSON(200, gin.H{"token": ctx.Request.Header.Get("Authorization")})
	} else {
		tokenString, err := sessionToJWT(ctx)
		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(200, gin.H{"token": tokenString})
	}
}

func checkIfTokenNeeded(ctx *gin.Context) bool {
	userToken := ctx.Request.Header.Get("Authorization")
	if userToken == "" {
		return true
	}
	if checkJWTexpiry(&jwt.Token{}) {
		return true
	}
	token, err := jwt.Parse(userToken, func(token *jwt.Token) (interface{}, error) {
		return key, nil
	})
	if err != nil {
		return true
	}
	if !token.Valid {
		return true
	}
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return true
	}
	return false
}
