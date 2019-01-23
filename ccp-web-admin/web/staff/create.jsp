<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">
<head>
    <jsp:include page="../header.jsp"/>
    <title>CCP Admin</title>
</head>

<body>

<div id="wrapper">

    <!-- Navigation -->
    <jsp:include page="../navigation.jsp"/>


    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">Create Staff</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Create New Staff
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-6">
                                <form role="form">

                                    <div class="form-group">
                                        <label>First Name</label>
                                        <input class="form-control" placeholder="First Name">
                                    </div>
                                    <div class="form-group">
                                        <label>Last Name</label>
                                        <input class="form-control" placeholder="Last Name">
                                    </div>
                                    <div class="form-group">
                                        <label>User Name (required)</label>
                                        <input class="form-control" placeholder="User Name">
                                    </div>
                                    <div class="form-group">
                                        <label>Password (required)</label>
                                        <input class="form-control" type="password" placeholder="Password">
                                    </div>
                                    <div class="form-group">
                                        <label>Confirm Password </label>
                                        <input class="form-control" type="password" placeholder="Confirm Password">
                                    </div>
                                    <button type="submit" class="btn btn-default">Submit</button>
                                    <button type="reset" class="btn btn-default">Reset</button>
                                </form>

                            </div>
                            <!-- /.col-lg-6 (nested) -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label>Email Address (required)</label>
                                    <input class="form-control" placeholder="Email Address">
                                </div>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input class="form-control" type="number" placeholder="Phone Number">
                                </div>
                                <div class="form-group">
                                    <label>Gender</label>
                                    <select class="form-control">
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Date of Birth</label>
                                    <input class="form-control" type="date" placeholder="Date of Birth">
                                </div>
                                <div class="form-group">
                                    <label>Address</label>
                                    <input class="form-control" placeholder="Address">
                                </div>
                            </div>
                            <!-- /.col-lg-6 (nested) -->
                        </div>
                        <!-- /.row (nested) -->
                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /#page-wrapper -->

</div>
<!-- /#wrapper -->

<jsp:include page="../footer_javascript.jsp"/>

<!-- Page-Level Demo Scripts - Tables - Use for reference -->
<script>
    $(document).ready(function () {
        $('#dataTables-example').DataTable({
            responsive: true
        });
    });
</script>
</body>

</html>
