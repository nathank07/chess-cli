package main

import (
	"fmt"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("./dist/*.html")
	router.Static("./assets", "./dist/assets")
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "index.html", gin.H{})
	})
	router.GET("/:path", func(ctx *gin.Context) {
		path := ctx.Param("path")
		if matched, _ := regexp.MatchString("^[0-9]+$", path); matched {
			ctx.HTML(http.StatusOK, "game.html", gin.H{"id": path})
		} else {
			_, err := os.Stat("dist/" + path + ".html")
			if err == nil && path != "game" {
				ctx.HTML(http.StatusOK, path+".html", gin.H{})
			} else {
				ctx.AbortWithStatus(http.StatusNotFound)
			}
		}
	})
	router.POST("/login", handleLogin)
	router.POST("/register", handleLogin)
	router.Run(":8081")
}

// TODO: Put users in database

func handleRegistry(ctx *gin.Context) {
	username := ctx.PostForm("username")
	password := ctx.PostForm("password")
	confirm := ctx.PostForm("confirm")
	email := ctx.PostForm("email")

	if username == "in database" {
		ctx.JSON(400, gin.H{"status": "Username was taken."})
	}
	if email == "in database" {
		ctx.JSON(400, gin.H{"status": "Email already registered."})
	}
	if password != confirm {
		ctx.JSON(400, gin.H{"status": "Passwords do not match."})
		return
	}
	ctx.JSON(200, gin.H{"status": "Registered!"})
}

func handleLogin(ctx *gin.Context) {
	username := ctx.PostForm("username")
	password := ctx.PostForm("password")
	fmt.Println(username)
	fmt.Println(password)
}
