package main

import (
	"database/sql"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Username regex doesn't check for consecutive spaces because database trims anyways
const usernameRegex = "^[a-zA-Z0-9 _-]{2,16}$"

type PasswordRequirements struct {
	MinLength    int
	HasUppercase *regexp.Regexp
	HasDigit     *regexp.Regexp
}

func (pr *PasswordRequirements) Validate(password string) bool {
	return len(password) >= pr.MinLength &&
		pr.HasUppercase.MatchString(password) &&
		pr.HasDigit.MatchString(password)
}

func handleLogin(ctx *gin.Context) {
	username := ctx.PostForm("username")
	password := ctx.PostForm("password")
	if dbHasUser(username) && checkPassword(username, password) {
		createSession(ctx, username)
		ctx.Redirect(302, "/")
		return
	}
	ctx.JSON(401, gin.H{"status": "Invalid username or password."})
}

func handleLogout(ctx *gin.Context) {
	session, _ := store.Get(ctx.Request, "login-session")
	session.Options.MaxAge = -1
	err := session.Save(ctx.Request, ctx.Writer)
	if err != nil {
		panic(err)
	}
	ctx.Redirect(302, "/")
	return
}

func handleRegistry(ctx *gin.Context) {
	username := ctx.PostForm("username")
	password := ctx.PostForm("password")
	confirm := ctx.PostForm("confirm")
	email := ctx.PostForm("email")

	if dbHasUser(username) {
		ctx.JSON(400, gin.H{"status": "Username was taken."})
		return
	}
	if email != "" && dbHasEmail(email) {
		ctx.JSON(400, gin.H{"status": "Email already registered."})
		return
	}
	if password != confirm {
		ctx.JSON(400, gin.H{"status": "Passwords do not match."})
		return
	}
	if !regexp.MustCompile(usernameRegex).MatchString(username) {
		ctx.JSON(400, gin.H{"status": "Invalid username."})
		return
	}
	pwReq := PasswordRequirements{8, regexp.MustCompile("[A-Z]"), regexp.MustCompile("[a-z]")}
	if !pwReq.Validate(password) {
		ctx.JSON(400, gin.H{"status": "Invalid password."})
		return
	}
	registerUser(username, password, email)
	createSession(ctx, username)
	ctx.Redirect(302, "/")
	return
}

func registerUser(username string, password string, email string) error {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		return err
	}
	defer db.Close()

	statement, err := db.Prepare("INSERT INTO user (username, password, email) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer statement.Close()

	password = hashPassword(password)

	if email == "" {
		_, err = statement.Exec(username, password, nil)
	} else {
		_, err = statement.Exec(username, password, email)
	}

	if err != nil {
		return err
	}
	return nil
}

func hashPassword(password string) string {
	bytes := []byte(password)

	hashedPassword, err := bcrypt.GenerateFromPassword(bytes, bcrypt.MinCost)
	if err != nil {
		panic(err)
	}

	return string(hashedPassword)
}

func checkPassword(username string, password string) bool {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	var hash string
	username = strings.ToLower(strings.TrimSpace(username))
	err = db.QueryRow("SELECT password FROM user WHERE TRIM(LOWER(username)) = ?", username).Scan(&hash)
	if err != nil {
		panic(err)
	}
	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func createSession(ctx *gin.Context, username string) {
	session, _ := store.Get(ctx.Request, "login-session")
	db, err := sql.Open("sqlite3", dbLoc)
	var id int
	if err != nil {
		panic(err)
	}
	stripped_username := strings.ToLower(strings.TrimSpace(username))
	err = db.QueryRow("SELECT id FROM user WHERE TRIM(LOWER(username)) = ?", stripped_username).Scan(&id)
	if err != nil {
		panic(err)
	}
	session.Values["username"] = username
	session.Values["id"] = id
	err = session.Save(ctx.Request, ctx.Writer)
	if err != nil {
		panic(err)
	}
}

func dbHasUser(username string) bool {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	var username_exists int
	stripped_username := strings.ToLower(strings.ReplaceAll(username, " ", ""))
	err = db.QueryRow("SELECT COUNT(*) FROM user WHERE REPLACE(LOWER(username), ' ', '') = ?;", stripped_username).Scan(&username_exists)
	if err != nil {
		panic(err)
	}
	return username_exists > 0
}

func dbHasEmail(email string) bool {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	var email_exists int
	stripped_email := strings.ToLower(strings.TrimSpace(email))
	err = db.QueryRow("SELECT COUNT(TRIM(LOWER(email))) FROM user WHERE email=(?);", stripped_email).Scan(&email_exists)
	if err != nil {
		panic(err)
	}
	return email_exists > 0
}
